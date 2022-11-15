
// aes加密接口demo

const { get, getText, post, postByFormData, put, del , postFormData, md5 } = require('./lib/tool')
const { ECB } = require('./lib/AES');
;

async function aesPost(url, {data = {},token= "", headers={}}) {
    const key = "c1kgVioySoUVimtw";
    const content = "timestamp||random||" + token + "||" + JSON.stringify(data);
    const sign = ECB.encryptToBase64(content, key);

    Object.assign(headers, {
        appleType: 1,
        random: "random",
        timestamp: "timestamp",
        Authorization: token,
        signature: sign
    })

    const d = {
        raw: ECB.encryptToBase64(JSON.stringify(data), key)
    }

    return await post(url, {
        data: d,
        headers,
        responseType: 'json'
    });
}

async function main() {

    const BASE = "http://localhost:9013";
    console.log(await aesPost(BASE + '/demo/testText', {
        data: {a: 'abc'}
    }));

    // otpauth://totp/project:lemon?secret=HYFJKAYY35NK3ODI&issuer=project


    // console.log(await aesPost(BASE + '/mem/login', {
    //     data: {
    //         mobile: '138888888890',
    //         password: md5('123456')
    //     }
    // }))

    // const token = "b141733b0da047fcc3e6db2d4ae50901";
    // console.log(await aesPost(BASE + '/mem/logout', {
    //     data: {

    //     },
    //     token
    // }))

    // console.log(await aesPost(BASE + '/demo/testText2', {
    //     data: {a: 'abc'},
    //     token: token
    // }));

    // console.log(await aesPost(BASE + '/mem/register', {
    //     data: {
    //         mobile: '138888888890',
    //         password: '123456',
    //         confirmPassword: '123456',
    //         inviteCode: 'DEHGQH'
    //     }
    // }))

}
main();

