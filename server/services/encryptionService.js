const path = require('path');
const CryptoJS = require('crypto-js');

// Try to read ENCRYPTION_SECRET_KEY from process.env. If it's not set yet,
// attempt to load a .env file relative to the server folder as a fallback.
let secretKey = process.env.ENCRYPTION_SECRET_KEY;
if (!secretKey) {
  try {
    // require dotenv locally and load from the server root (one level up from services)
    /* eslint-disable global-require */
    const dotenv = require('dotenv');
    dotenv.config({ path: path.join(__dirname, '..', '.env') });
    /* eslint-enable global-require */
    secretKey = process.env.ENCRYPTION_SECRET_KEY;
  } catch (err) {
    // If dotenv isn't available, we'll handle missing key below when functions are used
  }
}

// Helper to ensure secret is available when performing crypto operations.
function ensureSecret() {
  if (!secretKey) {
    // Defer throwing until an actual operation is attempted so requiring this module
    // doesn't crash the whole app during startup.
    throw new Error('ENCRYPTION_SECRET_KEY is not set. Please add it to your .env file.');
  }
}

// Function to encrypt text
const encrypt = (text) => {
  ensureSecret();
  return CryptoJS.AES.encrypt(text, secretKey).toString();
};

// Function to decrypt text
const decrypt = (ciphertext) => {
  ensureSecret();
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

module.exports = { encrypt, decrypt };
