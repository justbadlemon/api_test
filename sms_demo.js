// 短信接入demo

const got = require('got');
const { print, hex_md5 } = require('./lib/sys');
const moment = require('moment');


const { get, getText, post, postByFormData, put, del , postFormData } = require('./lib/tool')
const qs = require('qs');


async function main() {

    let url = 'http://118.31.174.89:8088/v2sms.aspx?action=send';

    let timestamp = moment().format('YYYYMMDDHHmmss');
    let username = 'ycy888';
    let password = 'qwe520520';

    let sign = hex_md5(username + password + timestamp);



    let data = {
        userid: '441',
        timestamp: timestamp,
        sign: sign,
        mobile: '',
        content: '【测试短信】test2',
        //sendTime: null,
        action: 'send',
        rt: 'json'
    }


    const { body } = await got.post(url, {
        form: data,
        responseType: 'json'
    })
    console.log(body);
    // printText(res);

}
module.exports = main;
