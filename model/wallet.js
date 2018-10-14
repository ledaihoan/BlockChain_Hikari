const { Wallet, CoinType, EthWallet,BchWallet, InfinitoApi, NeoWallet } = require('node-infinito-wallet');
const env = process.argv[2] || process.env.NODE_ENV || 'development';
const API_CONFIG = require("../config/infinito-sdk")[env];
const isTestNest = API_CONFIG.isTestNet || false;
const apiConfig = {
    apiKey: API_CONFIG.apiKey,
    secret: API_CONFIG.secret,
    baseUrl: API_CONFIG.baseUrl,
    logLevel: API_CONFIG.logLevel || 'NONE',
    version: API_CONFIG.version,
};

function genWalletConfig() {
    return {
        coinType: CoinType.ETH.symbol,  //change for case LTC, DOGE, DASH
        isTestNet: isTestNest,
    }
}

function genNewWallet(privateKey) {
    let config = genWalletConfig();

    let api = new InfinitoApi(apiConfig);
    let wallet = new Wallet(config);
    wallet.setApi(api);
    return wallet;
}

function genWalletOpt(privateKey) {
    const opts = {
        apiKey: API_CONFIG.apiKey,
        secret: API_CONFIG.secret,
        baseUrl: API_CONFIG.baseUrl,
        logLevel: API_CONFIG.logLevel || 'NONE',
        coinType: CoinType.ETH.symbol,
        isTestNet: API_CONFIG.testnet || false,

        // '0x77d6f0d8768942c098e664bb4e930c5019755b90d6b0fb2fb43450d6270efb3d'
        // '0x6426b293207e124d334c8cb44380a4999ecc900e'

    };
    if(privateKey) opts.privateKey = privateKey;
    return opts;
}

function getWallet(privateKey) {
    let opts = genWalletOpt(privateKey);
    let api = new InfinitoApi(opts);
    let wallet = new EthWallet(opts);
    wallet.setApi(api);
    return wallet;
}

async function getBlance(privateKey) {
    return await getWallet(privateKey).getBalance();
}

async function getHistory(privateKey, num) {
    return await getWallet(privateKey).getHistory(0, num || 10);
}

// async function getContractBalance(scAdress) {
//     let result = await wallet.getContractBalance(scAdress);
//     return result;
// }

async function getTxCount(privateKey) {
    let result = await getWallet(privateKey).getTxCount();
    return result;
}
module.exports = {
    genNewWallet: genNewWallet,
    getWallet: getWallet,
    getBlance: getBlance,
    getHistory: getHistory,
    getTxCount: getTxCount
};
///if you have privateKey then supply private key to create wallet or you can pass passphrase to create wallet
// let walletConfig = {
//     coinType: CoinType.ETH.symbol,  // change for case ETH
//     isTestNet: true,
//     privateKey: '43886D62B61B4C0FC85F846B3397E6397C890925AD7479CDCEC3A9062CD73995'
// };
// async function callSmartContract(walletConfig, address, functionName, types, params) {
//     let wallet = new EthWallet(walletConfig);
//     wallet.setApi(api);
//     let txParams = {
//         contractAddress: address,
//         nameFunc: functionName,
//         typeParams: types,
//         paramsFuncs: params
//     };
//     let rawTx = await wallet.createRawTx(txParams);
//     console.log('rawTx = ' + rawTx);
//     let result = await wallet.send({
//         rawTx: rawTx,
//         // txParams: txParams,
//         isBroadCast: true
//     });
//     return result;
// }
