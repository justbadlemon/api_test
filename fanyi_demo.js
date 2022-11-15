// 翻译接口demo

const { get, getText, post, postByFormData, put, del , postFormData } = require('./lib/tool')
const { print, printTxt, readFile } = require('./lib/sys');
/**
    * @param target   需要翻译的文字
    * @param tl       翻译的目标语言 默认 'en'
    * @param sl       需要翻译文字所属语言 默认  'auto'
    * @param opt      其他参数
    */
let gTranslate = require('google-translate-node');

async function translateProperties(filePath, lang, exFile ) {
    const text = await readFile(filePath);
    let list = text.split('\n').map(ln => ln.replace('\r','').split('='));
    let json = {};
    for(let ls of list) {
        let [k,v] = ls;
        json[k] = v;
    }
    let map = {};
    let i = 0, len = Object.keys(json).length;
    for (let key of Object.keys(json)) {
        let value = json[key];
        console.log(`正在翻译第个文本 ${value}: (${++i}/${len})`)
        try {
            let res = await gTranslate(value, lang);
            console.log(`${value} res: ${res}`);
            map[key] = res;
        } catch(e) {}
    }
    let temp = [];
    for (let k of Object.keys(map)) {
        let v = map[k];
        let lan = k + '=' + v;
        temp.push(lan);
    }

    await printTxt(temp.join('\n'), exFile);
}


async function translateFile(filePath, lang, exFile ) {
    let json = require(filePath);
    let i = 0, len = Object.keys(json).length;
    let map = {};
    for (let key of Object.keys(json)) {
        let value = json[key];
        console.log(`正在翻译第个文本 ${value}: (${++i}/${len})`)
        try {
            let res = await gTranslate(value, lang);
            console.log(`${value} res: ${res}`);
            map[key] = res;
        } catch(e) {}
    }
    let content = JSON.stringify(map, null, '\t');
    content = 'export const index = ' + content;
    await printTxt(content, exFile);
}

;
async function main() {
    const root = 'C:\\Users\\Administrator\\Desktop\\langs\\';
    const filename = root + 'test.txt';
    for(let k of [
        'id',
        // 'ja',
        'ms',
        'th',
        'zh_tw'
    ]) {
        let target = 'D:\\projects\\yami-shop-java\\yami-shop-common\\src\\main\\resources\\i18n\\';
        try {
            await translateProperties(filename, k, target + 'messages_' +k + '.properties');
        } catch(e) {
            console.error(e);
        }
    }

}

main();
