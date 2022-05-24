const CryptoJS = require("crypto-js");

var keySize = 256;
var ivSize = 128;
var iterations = 1000;

var data = JSON.stringify({something: "abc def ghi", account: "account", created_at: "2022-05-24T07:19:02+00:00"});
var password = "123456";

// Encrypt
function encrypt (msg, pass) {
  var salt = CryptoJS.lib.WordArray.random(16);
  var key = CryptoJS.PBKDF2(password, salt, {
    keySize: keySize/32,
    iterations: iterations,
    hasher: CryptoJS.algo.SHA256
  });
  var iv = CryptoJS.lib.WordArray.random(ivSize/8);

  var encrypted = CryptoJS.AES.encrypt(data, key, {
    iv: iv,
    hasher: CryptoJS.algo.SHA256
  });

  var transitMessage = salt.toString() + iv.toString() + encrypted.toString();
  return transitMessage;
}

// Decrypt
function decrypt(transitMessage, password) {
  var salt = CryptoJS.enc.Hex.parse(transitMessage.substr(0, 32));
  var iv = CryptoJS.enc.Hex.parse(transitMessage.substr(32, 32));
  var encrypted = transitMessage.substring(64);

  var key = CryptoJS.PBKDF2(password, salt, {
    keySize: keySize/32,
    iterations: iterations,
    hasher: CryptoJS.algo.SHA256
  });

  var decrypted = CryptoJS.AES.decrypt(encrypted, key, {
    iv: iv,
    hasher: CryptoJS.algo.SHA256
  });

  return decrypted;
}

console.log(
  JSON.parse(
    decrypt(
      encrypt(data, password), 
      password)
.toString(CryptoJS.enc.Utf8)));
