let jwt = require('jsonwebtoken');
const config = require('../model/config.js');

let checkToken = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization'];

  if (token) {
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        res.status(500).send("Token is not valid");
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } 
  else {
    res.status(500).send("Auth token is not supplied");
  }
};

module.exports = {
  checkToken: checkToken
}