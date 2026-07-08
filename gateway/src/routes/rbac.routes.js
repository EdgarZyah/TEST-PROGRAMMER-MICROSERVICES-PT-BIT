const express = require('express');
const proxy = require('express-http-proxy');
const authMiddleware = require('../middleware/auth.middleware');
const rbacMiddleware = require('../middleware/rbac.middleware');
const securityMiddleware = require('../middleware/security.middleware');

const router = express.Router();
const RBAC_TARGET = process.env.RBAC_SERVICE_URL || 'http://localhost:3002';

const rbacProxy = proxy(RBAC_TARGET, {
  proxyReqPathResolver: (req) => {
    if (req.method === 'GET') return '/users';
    if (req.method === 'POST') return '/add_users';
    if (req.method === 'PUT') return `/update_users/${req.params.id}`;
    if (req.method === 'DELETE') return `/delete_users/${req.params.id}`;
    return req.url;
  },
  proxyReqBodyDecorator: (bodyContent, srcReq) => {
    if (srcReq.body && typeof srcReq.body === 'object' && Object.keys(srcReq.body).length > 0) {
      return JSON.stringify(srcReq.body);
    }
    return bodyContent;
  },
});

router.get('/users', authMiddleware, rbacMiddleware('ADMIN'), securityMiddleware, rbacProxy);
router.post('/users', authMiddleware, rbacMiddleware('ADMIN'), securityMiddleware, rbacProxy);
router.put('/users/:id', authMiddleware, rbacMiddleware('ADMIN'), securityMiddleware, rbacProxy);
router.delete('/users/:id', authMiddleware, rbacMiddleware('ADMIN'), securityMiddleware, rbacProxy);

module.exports = router;
