const jwt = require('jsonwebtoken');

function authenticateTokenWebSock(token) {
    try {
        const decoded = jwt.verify(token, 'yourSecretKey');
        return { valid: true, user: decoded };
      } catch (err) {
        return { valid: false };
      }
}

module.exports = {
    authenticateTokenWebSock
};

