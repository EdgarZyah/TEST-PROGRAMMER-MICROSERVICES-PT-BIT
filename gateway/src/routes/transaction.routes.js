const express = require('express');
const proxy = require('express-http-proxy');
const authMiddleware = require('../middleware/auth.middleware');
const rbacMiddleware = require('../middleware/rbac.middleware');
const securityMiddleware = require('../middleware/security.middleware');

const router = express.Router();
const TX_TARGET = process.env.TRANSACTION_SERVICE_URL || 'http://localhost:3004';

function injectPembeliId(req, res, next) {
  if (['POST', 'PUT'].includes(req.method) && req.user) {
    if (!req.body || typeof req.body !== 'object') {
      req.body = {};
    }
    req.body.pembeli_id = req.user.user_id;
  }
  next();
}

const txProxy = proxy(TX_TARGET, {
  proxyReqPathResolver: (req) => {
    if (req.method === 'POST' && req.path === '/cart/add') return '/cart/add';
    if (req.method === 'GET' && req.path === '/cart') {
      return `/cart/${req.user.user_id}`;
    }
    if (req.method === 'POST' && req.path === '/checkout') return '/checkout';
    if (req.method === 'GET' && req.path === '/transactions') {
      if (req.user.role === 'ADMIN') return '/transactions/all';
      return `/transactions/${req.user.user_id}`;
    }
    if (req.method === 'PUT' && req.params.id) {
      return `/transactions/${req.params.id}/pay`;
    }
    return req.url;
  },
  proxyReqBodyDecorator: (bodyContent, srcReq) => {
    if (srcReq.body && typeof srcReq.body === 'object' && Object.keys(srcReq.body).length > 0) {
      return JSON.stringify(srcReq.body);
    }
    return bodyContent;
  },
});

router.post('/cart/add', authMiddleware, rbacMiddleware('PEMBELI'), injectPembeliId, securityMiddleware, txProxy);
router.get('/cart', authMiddleware, rbacMiddleware('PEMBELI'), securityMiddleware, txProxy);
router.post('/checkout', authMiddleware, rbacMiddleware('PEMBELI'), injectPembeliId, securityMiddleware, txProxy);
router.get('/transactions', authMiddleware, rbacMiddleware('PEMBELI', 'ADMIN'), securityMiddleware, txProxy);
router.put('/transactions/:id/pay', authMiddleware, rbacMiddleware('PEMBELI', 'ADMIN'), injectPembeliId, securityMiddleware, txProxy);

module.exports = router;
