const InfinitoApi = require('node-infinito-api');
const env = process.argv[2] || process.env.NODE_ENV || 'development';
const API_CONFIG = require("../config/infinito-sdk")[env];
const opts = {
    apiKey: API_CONFIG.apiKey,
    secret: API_CONFIG.secret,
    baseUrl: API_CONFIG.baseUrl,
    logLevel: API_CONFIG.logLevel || 'NONE',
    version: API_CONFIG.version
};
const api = new InfinitoApi(opts);


async function getBalanceErc20(address, scAddress) {
    const coinAPI = api.ETH;
    return await coinAPI.getContractBalance(scAddress, address);
}
async function getSmartContractInfo(coinAPI, scAddress) {
    const result = await coinAPI.getSmartContractInfo(scAddress);
    return result;
}

async function deploySmartContract() {

}
(async() => {

    let res = await getSmartContractInfo(api.ETH, "0x86fa049857e0209aa7d9e616f7eb3b3b78ecfdb0");
    console.log(res);
})();
