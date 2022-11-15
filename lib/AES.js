const CryptoJS = require('crypto-js');

module.exports = {
    ECB: {
        encryptToHex: function (word, keyStr) {
            var key = CryptoJS.enc.Utf8.parse(keyStr);
            var srcs = CryptoJS.enc.Utf8.parse(word);
            var encrypted = CryptoJS.AES.encrypt(srcs, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7});
            var data = encrypted.ciphertext.toString();
            return data
        },
        decryptForHex: function (word, keyStr) {
            var key = CryptoJS.enc.Utf8.parse(keyStr);
            var encryptedHexStr = CryptoJS.enc.Hex.parse(word)
            var encryptedBase64Str = CryptoJS.enc.Base64.stringify(encryptedHexStr)
            
            var decrypt = CryptoJS.AES.decrypt(encryptedBase64Str, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7});
            return CryptoJS.enc.Utf8.stringify(decrypt).toString();
        },
        encryptToBase64: function (word, keyStr) {
            var key = CryptoJS.enc.Utf8.parse(keyStr);
            
            var encrypted = CryptoJS.AES.encrypt(word, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7});
            return encrypted.toString();
        },
        decryptForBase64: function (word, keyStr) {
            var key = CryptoJS.enc.Utf8.parse(keyStr);

            var decrypt = CryptoJS.AES.decrypt(word, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7});
            return CryptoJS.enc.Utf8.stringify(decrypt).toString();
        }
    }
}
