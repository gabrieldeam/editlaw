// generateKey.js
const crypto = require('crypto');

const key = crypto.randomBytes(32);
console.log(key.toString('hex')); // Exibe a chave em hexadecimal
