// 助记词生成钱包地址demo
let hdAddress = require('hd-address');
let mnemonic = 'flock arrow acid move wall today search sudden milk enjoy key rent';


let hdwallet = hdAddress.HD(mnemonic)['TRX'];
let wallet = hdwallet.getCoinAddressKeyPair(0);
console.log(wallet)
console.log(hdwallet.getAddress(0))
