const got = require('got');

const fs = require('fs');
const path = require('path');
const stream = require('stream');
const { promisify } = require('util');
const FormData = require('form-data');
const crypto = require('crypto');
const { ECB } = require('./AES');
const qs = require('qs');


const pipeline = promisify(stream.pipeline);


async function postFormData(url, fileItems = {}, data = {}, headers = {}) {
    const form = buildFormData(fileItems, data)
    for (let k of Object.keys(data)) {
        form.append(k, data[k])
    }
    return await got.post(url, {
        body: form,
        headers: {
            ...form.getHeaders(),
            ...headers
        },
        responseType: 'json',
    })
}

async function postByFormData(url, {data, headers, responseType='json'}) {
    const form = new FormData();
    for (let k of Object.keys(data)) {
        console.log(k, data[k])
        form.append(k, data[k])
    }
    return await got.post(url, {
        body: form,
        headers: headers,
        responseType: responseType,
    })
}


async function postForFormData(url, form, headers = {}) {
    let myheaders = {
        ...form.getHeaders(),
        ...headers
    };
    console.log(myheaders)
    return await got.post(url, {
        body: form,
        myheaders,
        responseType: 'json',
    })
}

function buildFormData(fileItems = {}, data = {}) {
    const form = new FormData();
    for (let k of Object.keys(fileItems)) {
        let items = fileItems[k];
        if (Array.isArray(items)) {
            for (let item of items) {
                form.append(k, fs.createReadStream(item));
            }
        } else {
            form.append(k, fs.createReadStream(items));
        }

    }
    for (let k of Object.keys(data)) {
        form.append(k, data[k])
    }
    return form;
}

async function getText(url, {query, headers}) {
    if (query) {
        url = url + '?' + qs.stringify(query);
    }
    return await got(url, {
        headers
    })
}

async function downloadImage(url, out) {
    let dir = getDir(out);
    if (!fs.existsSync(dir)) {
        await mkdir(dir);
    }
    await pipeline(
        got.stream(url),
        fs.createWriteStream(out)
    );
    console.log('writed: ' + out)
}

function getDir(url) {
    return url.substring(0, url.lastIndexOf('/'))
}

async function mkdir(reaPath) {
    const absPath = path.resolve(__dirname, reaPath);
    try {
        await fs.promises.stat(absPath)
    } catch (e) {
        // 不存在文件夹，直接创建 {recursive: true} 这个配置项是配置自动创建多个文件夹
        await fs.promises.mkdir(absPath, { recursive: true })
    }
}


function sha256(str) {
    return crypto.createHash('SHA256').update(str).digest('hex');
}

function hmac_sha256(secretKey, str) {
    return crypto.createHmac('SHA256', secretKey).update(str).digest('hex');
}

function md5(str) {
    return crypto.createHash('md5').update(str).digest('hex').toLowerCase();
}


async function get(url, { query, headers, responseType = 'json' }) {
    if (query) {
        url = url + '?' + qs.stringify(query);
    }
    const { body } = await got.get(url, {
        headers,
        responseType: responseType
    });
    return body;
}

async function post(url, { data, headers, responseType = 'json' }) {
    const { body } = await got.post(url, {
        json: data,
        headers,
        responseType: responseType
    });
    return body;
}

async function put(url, { data, headers, responseType = 'json' }) {
    const { body } = await got.put(url, {
        json: data,
        headers,
        responseType: responseType
    });
    return body;
}

async function del(url, { data, headers, responseType = 'json'}) {
    const { body } = await got.delete(url, {
        json: data,
        headers,
        responseType: responseType
    });
    return body;
}

module.exports = {
    getText,
    downloadImage,
    postFormData,
    sha256,
    hmac_sha256,
    postForFormData,
    buildFormData,
    md5,
    get,
    post,
    postByFormData,
    put,
    del
}