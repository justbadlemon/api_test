
const {
    MANAGE_SERVER,
    VIDEO_SERVER,
    APP_SERVER
} = require('../cfg/config');
const {
    printTxt
} = require('./sys')


function buildPostFn(name, uri) {
    return `    ${name}: async function(data, token) {
        const res = await post('${uri}', data, { Authorization: token });
        //await print(res.body);
        return res.body;
    },\n`
}

function buildGetFn(name, uri) {
    return `    ${name}: async function(params, token) {
        const res = await get('${uri}?' + qs.stringify(params), { Authorization: token });
        //await print(res.body);
        return res.body;
    },\n`
}

function buildGetAppTokenFn(account, password) {
    return `    getAppToken: async function(account = '${account}', password = '${password}') {
        const res = await post('${APP_SERVER}/login/pc/v1/login', {
            account: account,
            password: hex_md5(password)
        });
        console.log(res.body)
        return res.body.data.acctoken;
    },\n`
}

function buildGetBaseTokenFn(account, password) {
    return `    getBaseToken: async function(account = '${account}', password = '${password}') {
        const res = await post('${MANAGE_SERVER}/manage/login', {
            accLogin: account,
            password: hex_md5(password)
        });
        console.log(res.body)
        return res.body.data.accToken;
    },\n`;
}

async function build(config, root = './case') {
let head =  `
const {
    get,
    post,
    postFormData
} = require('../lib/tool');
const {
    hex_md5,
    print
} = require('../lib/sys');
const qs = require('qs');
`;
    const modNames = Object.keys(config);
    const BASE_URL_MAP = { APP: APP_SERVER, MANAGE: MANAGE_SERVER, VIDEO: VIDEO_SERVER}
    
    
    for (let modName of modNames) {
        let code = '';
        code += head;
        code += 'module.exports = { \n';
        let baseUrl = BASE_URL_MAP[modName];
        let {POST, GET} = config[modName];
        let postNames = Object.keys(POST);
        for (let postName of postNames) {
            let uri = POST[postName];
            let url = baseUrl + uri;
            code += buildPostFn(postName, url);
        }
        let getNames = Object.keys(GET);
        for (let getName of getNames) {
            let uri = GET[getName];
            let url = baseUrl + uri;
            code += buildGetFn(getName, url);
        }
        if (modName == 'APP') {
            code += buildGetAppTokenFn('lennox', '123456')
        }
        if (modName == 'MANAGE') {
            code += buildGetBaseTokenFn('sa', 'lennox666')
        }
        code += '\n}';
        await printTxt(code, `${root}/${modName}.js`);
    }
}
module.exports = build;