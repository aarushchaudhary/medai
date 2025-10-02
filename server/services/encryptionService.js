const CryptoJS = require('crypto-js');

// IMPORTANT: Your secret key should be stored securely in your .env file
const secretKey = process.env.ENCRYPTION_SECRET_KEY;

if (!secretKey) {
  throw new Error("ENCRYPTION_SECRET_KEY is not set in the .env file.");
}

// Function to encrypt text
const encrypt = (text) => {
  return CryptoJS.AES.encrypt(text, secretKey).toString();
};

// Function to decrypt text
const decrypt = (ciphertext) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

module.exports = { encrypt, decrypt };
