const jwt = require('jsonwebtoken');

module.exports = function auth(req, res, next) {
  const authorization = req.get('Authorization');
  const match = authorization?.match(/^Bearer\s+(\S+)$/i);
  // 同时支持课件中的 x-auth-token 和 Postman 的 Bearer Token。
  const token = match?.[1] || (!authorization && req.get('x-auth-token'));
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    if (!decoded.user?.id) throw new Error('missing user id');
    req.user = decoded.user;
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Token is not valid' });
  }
};
