const express = require('express');
const proxy = require('express-http-proxy');
const authMiddleware = require('../middleware/auth.middleware');
const rbacMiddleware = require('../middleware/rbac.middleware');
const securityMiddleware = require('../middleware/security.middleware');

const router = express.Router();
const MASTER_TARGET = process.env.MASTER_SERVICE_URL || 'http://localhost:3003';

const masterProxy = proxy(MASTER_TARGET, {
  proxyReqPathResolver: (req) => {
    if (req.method === 'GET' && req.params.id) return `/products/${req.params.id}`;
    if (req.method === 'GET') return '/products';
    if (req.method === 'POST') return '/products';
    if (req.method === 'PUT') return `/products/${req.params.id}`;
    if (req.method === 'DELETE') return `/products/${req.params.id}`;
    return req.url;
  },
  proxyReqBodyDecorator: (bodyContent, srcReq) => {
    if (srcReq.body && typeof srcReq.body === 'object' && Object.keys(srcReq.body).length > 0) {
      return JSON.stringify(srcReq.body);
    }
    return bodyContent;
  },
});

router.get('/products', authMiddleware, rbacMiddleware('ADMIN', 'PEMBELI'), securityMiddleware, masterProxy);
router.get('/products/:id', authMiddleware, rbacMiddleware('ADMIN', 'PEMBELI'), securityMiddleware, masterProxy);
router.post('/products', authMiddleware, rbacMiddleware('ADMIN'), securityMiddleware, masterProxy);
router.put('/products/:id', authMiddleware, rbacMiddleware('ADMIN'), securityMiddleware, masterProxy);
router.delete('/products/:id', authMiddleware, rbacMiddleware('ADMIN'), securityMiddleware, masterProxy);

module.exports = router;
