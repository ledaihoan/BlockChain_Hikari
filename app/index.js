const env = process.argv[2] || process.env.NODE_ENV || 'development';
const SHA256 = require('crypto-js/sha256');
const expressConfig = require("../config/express")[env];
const express = require("express");
const PASSWORD = SHA256("hikari").toString();
const app = express();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const SESSION_TTL = 4 * 60 * 60 * 1000; //4hour
app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}))
app.use(express.urlencoded());
let options = expressConfig.staticFiles.options;
let path = expressConfig.staticFiles.path;
let dir = expressConfig.staticFiles.dir;

const userWalletInfo = {
    "privateKey": "0xb1fccdba242976c43fbff947037b32d955e56b539e194bbb92e0a7432038c96d",
    "coinType": "ETH",
    "address": "0x74adee0476c39d753559f974b773b7f24f814343",
    "publicKey": "0x46f641e74c6292c106b40b79fa5a780e5bb80ed73de685f6451a2d0f137fd24d46db51cb4213db700f3de89bb72a10637709faca061df1090dca6d671cc02f0e",

    // "publicKey": "0x971d364edae15bbc1ce117dc0e924614f18a48a03b88747a632f6127b91893e9e0f77bb37107cd740d2c57f061513f1018882b20940babb4bbbab14e233b985c",
};
app.use(path, express.static(dir, options));
function validateLogin(user, pass) {
    return pass == PASSWORD;
}
const wallet = require("../model/wallet");
function walletGen(request, response) {
    let password = request.query.password;
    console.log('generating wallet from pass = ' + password);
    let res = wallet.genNewWallet();
    response.json(res);
}
app.get("/walletGen", walletGen);

function handleAuthenticatedRequest(request, response, func) {
    if(validateSession(request)) {
        func(request, response);
    } else {
        let res = {
            error: true,
            invalidate: true
        };
        response.json(res);
    }
}
function validateSession(request) {
    let ssn = request.session;
    console.log(`${ssn.ttl}, ${Date.now()}, ${SESSION_TTL}`);
    if(!ssn || !ssn.acc || !ssn.ttl || Date.now() >= ssn.ttl) {
        invalidateSession(request);
        return false;
    }
    return true;
}
function checkLoginSession(acc, pass, request) {
    console.log(`${acc}, ${pass}`);
    // console.log('checking ' + validateSession(request) + "|" + validateLogin(acc, pass));
    if(validateSession(request) || validateLogin(acc, pass)) {
        return true;
    }
    return false;
}
function getWalletBalance(req, resp) {
    handleAuthenticatedRequest(req, resp, (request, response) => {
        (async () => {
            let privateKey = request.query.privateKey || userWalletInfo.privateKey;
            let result = await wallet.getBlance(privateKey);
            let res = {
                data: result //{address, balance}
            };
            let txCount = await wallet.getTxCount();
            res.txCount = txCount;
            response.json(res);
        })();
    });
}
app.get("/wallet/balance", getWalletBalance);
app.post("/wallet/balance", getWalletBalance);
let getWalletHistory = (req, resp) => {
    handleAuthenticatedRequest(req, resp, (request, response) => {
        (async () => {
            let privateKey = request.query.privateKey || userWalletInfo.privateKey
            let result = await wallet.getHistory(privateKey);
            let res = {
                data: result //{address, balance}
            };
            response.json(res);
        })();
    });
};
app.get("/wallet/history", getWalletHistory);
app.post("/wallet/history", getWalletHistory);
function invalidateSession(request) {
    delete request.session.acc;
    delete request.session.ttl;
}

app.post("/login", (request, response) => {
    let login = request.body.SqlParams || {};
    console.log(login);
    let acc = login.acc;
    let pass = login.shaPass;
    let ssn = request.session;
    let valid = checkLoginSession(acc, pass, request);

    let res = {

    };
    console.log('valid =' + valid);
    if(valid) {
        res.acc = 'Van';
        request.session.acc = 'Van';
        request.session.ttl = Date.now() + SESSION_TTL;
        console.log("ss = " + JSON.stringify(request.session));
    } else {
        invalidateSession(request);
    }
    response.json(res);
});
app.listen(expressConfig.port, expressConfig.host, () => {
    console.log(`http server listening on port ${expressConfig.port}`);
});