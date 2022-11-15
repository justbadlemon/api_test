const fs = require('fs');
const crypto = require('crypto');

function hex_md5(str) {
    return crypto.createHash('md5').update(str).digest('hex');
}

function hex_hmac_sha256(str, secrtekey){
    return crypto.createHmac('sha256', secrtekey).update(str).digest('hex');
}

function base64_hmac_sha256(str, secrtekey){
    return crypto.createHmac('sha256', secrtekey).update(str).digest('base64');
}

async function print(data, _path = './print.json') {
    return new Promise((resolve, reject) => {
        fs.writeFile(_path, JSON.stringify(data, null, '\t'), function(err){
            if (err) reject(err);
            resolve();
        })
    })
}

async function printTxt(data, _path = './print.json') {
    return new Promise((resolve, reject) => {
        fs.writeFile(_path, data, function(err){
            if (err) reject(err);
            resolve();
        })
    })
}

async function readFile(_path) {
    return new Promise((resolve, reject) => {
        fs.readFile(_path, 'utf-8', function(err,data){
            resolve(data);
        });
    })
}
;



module.exports = {
    hex_md5,
    hex_hmac_sha256,
    base64_hmac_sha256,
    print,
    printTxt,
    readFile
}