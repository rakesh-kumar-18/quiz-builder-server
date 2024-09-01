const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers['authorization'];
    if (!token) {
      res.status(400).send({
        message: 'token verify in middleware error',
      });
    }
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    req.userId = decode.userId;
    next();
  } catch (error) {
    return res.status(400).send({
      message: 'token verify in middleware error catch',
    });
  }
};

module.exports = { verifyToken };
