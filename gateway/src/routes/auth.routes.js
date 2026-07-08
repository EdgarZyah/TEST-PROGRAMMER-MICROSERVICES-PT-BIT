const express = require('express');
const proxy = require('express-http-proxy');
const authMiddleware = require('../middleware/auth.middleware');
const securityMiddleware = require('../middleware/security.middleware');

const router = express.Router();
const AUTH_TARGET = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';

const authProxy = proxy(AUTH_TARGET, {
  proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
    if (srcReq.headers.authorization) {
      proxyReqOpts.headers['authorization'] = srcReq.headers.authorization;
    }
    return proxyReqOpts;
  },
});

router.post('/login', securityMiddleware, authProxy);
router.get('/me', authMiddleware, securityMiddleware, authProxy);
router.post('/refresh-token', authMiddleware, securityMiddleware, authProxy);

module.exports = router;
