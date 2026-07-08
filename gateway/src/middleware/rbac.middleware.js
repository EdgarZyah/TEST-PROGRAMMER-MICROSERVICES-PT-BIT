module.exports = function rbacMiddleware(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const userRole = (req.user.role || '').toUpperCase();
    if (!allowedRoles.map(r => r.toUpperCase()).includes(userRole)) {
      return res.status(403).json({ error: 'Forbidden: insufficient permissions' });
    }

    next();
  };
};
