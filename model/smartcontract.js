let fs = require("fs");
let Web3 = require("web3");
const MY_ADDRESS = "0xA4e6C9E5223335Ba82c9788Df64335B4eb23B6EF";
const NODE_URL = "https://rinkeby.infura.io/eth";
async function deploy(contractName, contractArgs) {
    let web3 = new Web3(new Web3.providers.HttpProvider(NODE_URL));
    let abi = fs.readFileSync(contractName + ".abi").toString();
    let bin = fs.readFileSync(contractName + ".bin").toString();
    let contract = new web3.eth.Contract(JSON.parse(abi));
    await contract.deploy({data: "0x" + bin, arguments: contractArgs})
        .send({from: MY_ADDRESS, gasPrice: '1000', gas: 2310334});
    return contract;
}

(async () => {
    let res = await deploy("Coin", []);
    console.log(res);
})();