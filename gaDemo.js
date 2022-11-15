// 谷歌验证码demo

const { downloadImage } = require('./lib/tool')
;

const { authenticator } = require('google_authenticator');
const GoogleAuthenticator = authenticator;

async function gaDemo() {
    var ga =new GoogleAuthenticator();
    // 生成谷歌密钥
    const key = ga.createSecret();
    console.log(key);
    // 生成6位随机密码
    const code = ga.getCode(key);
    console.log(code);
    // 校验是否是正确的。
    let verify = ga.verifyCode(key, code);
    console.log(verify);
    // 生成可用于生成二维码的字符串
    let ct = ga.getQRCodeText('gaomaoge.com', key, 'lemon');
    console.log(ct);
    // 获取可以下载二维码的url
    let imgUrl = ga.getGoogleQRCodeAPIUrl('gaomaoge.com', key, 'lemon');
    console.log(imgUrl);
    // 下载二维码
    await downloadImage(imgUrl, './gaCode.png');
}

async function main() {
    gaDemo();
}
main();
