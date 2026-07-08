const INTERNAL_KEY = process.env.INTERNAL_KEY || 'gateway-secret';

module.exports = function securityMiddleware(req, res, next) {
  req.headers['x-internal-key'] = INTERNAL_KEY;
  next();
};
