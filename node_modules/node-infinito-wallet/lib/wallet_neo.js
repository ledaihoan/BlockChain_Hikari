
const CoinType = require('./coin_type');
const Wallet = require('./wallet');
const Neon = require('@cityofzion/neon-js');
const Constant = require('./constant');
const {
  AppError,
} = require('node-infinito-util');
const Messages = require('./messages');
const BigNumber = require('bignumber.js');

class NeoWallet extends Wallet {

  constructor(options) {
    options.coinType = CoinType.NEO.symbol;
    super(options);
  }

  /**
   * @param  {String} assetId                 (required)  Asset Id
   */
  async getBalance(assetId) {
    let result = await this.CoinApi.getBalance(this.Account.address, assetId);
    return this._getReponse(result);
  }


  /**
   */
  async getClaimable() {
    let result = await this.CoinApi.getClaimableGas(this.Account.address);
    return this._getReponse(result);
  }

  async getUnclaimed() {
    let result = await this.CoinApi.getUnclaimedGas(this.Account.address);
    return this._getReponse(result);
  }

  /**
   * @param  {String} scAddress               (required)  Address smart contract
   */
  async getContractInfo(scAddress) {
    let result = await this.CoinApi.getContractInfo(scAddress);
    return this._getReponse(result);
  }


  /**
   * @param  {String} scAddress               (required)  Address smart contract
   */
  async getContractBalance(scAddress) {
    let result = await this.CoinApi.getNEP5Balance(scAddress, this.Account.address);
    return this._getReponse(result);
  }
  /**
   * @param  {String} scAddress               (required)  Address smart contract
   * @param  {Number} offset
   * @param  {Number} limit
   */
  async getContractHistory(scAddress, offset, limit) {
    let result = await this.CoinApi.getNEP5History(scAddress, offset, limit);
    return this._getReponse(result);
  }


  /**
   * send transaction using rawTx if you have rawTx already or pass txParams in order to build rawTx. rawTx is priority
   * @param  {String}  {rawTx                  (optional)  raw transaction
   * @param  {String}   txParams.to            (required)  Address receiver
   * @param  {String}   txParams.assetSymbol   (required)  Asset Symbol
   * @param  {String}   txParams.assetId       (required)  AssetId
   * @param  {String}   txParams.amount        (required)  Amount 
   * @param  {Boolean}  isBroadCast = true }   (optional)  Send this transaction or just create raw
   * @returns {Object}  {raw:'',tx_id:''}
   */
  async send({
    rawTx,
    txParams,
    isBroadCast = true
  }) {

    let response = {
      raw: rawTx
    };

    if (!rawTx) {
      let rawTxData = await this.createRawTx(txParams);
      console.log('rawTxData', rawTxData);
      if (!rawTxData) {
        throw new AppError(Messages.create_crawtx_fail.message, Messages.create_crawtx_fail.code);
      }
      response = { raw: rawTxData };
    }

    if (isBroadCast) {
      let result = await this.CoinApi.sendTransaction({
        rawtx: response.raw
      });

      if (result.cd === 0) {
        return {
          tx_id: result.data.tx_id,
          raw: response.raw
        };
      }
      else {
        throw new AppError(result.message, Messages.create_transaction_fail.code);
      }
    }
    return response;
  }

  /**
 * @param  {String} contractAddress       (required) Adddress smart contract
 * @param  {String} to                    (required) Adddress receiver
 * @param  {Number} amount                (required) Amount token/coin
 * @returns {Object}   {raw:'',tx_id:''}
 */
  async transfer(contractAddress, to, amount, decimal = Constant.NEO.GASDecimal) {
    let rawTx = await this._createTransferTx(contractAddress, to, amount, decimal);
    return await this.send({
      rawTx: rawTx,
      isBroadCast: true
    });
  }


  /**
   * @returns {Object}   {raw:'',tx_id:''}
   */
  async claim() {
    let rawTx = await this._createClaimTx();
    return await this.send({
      rawTx: rawTx,
      isBroadCast: true
    });
  }

  /**
   * @param  {Object} params              (required)
   * @param  {String} params.to           (required)  Address receiver
   * @param  {String} params.assetSymbol  (required)  Asset Symbol
   * @param  {String} params.assetId      (required)  AssetId
   * @param  {String} params.amount       (required)  Amount 
   * @returns ''
   */
  async createRawTx(params) {
    let balance = new Neon.wallet.Balance();
    let outputs = [];
    let inputTxs = await this._getUnspendList(params.assetId);

    let balanceAsset = await this.getBalance(params.assetId);
    if (!balanceAsset) {
      return '';
    }
    params.balance = balanceAsset.assets[0].balance;

    let assetBalance = Neon.wallet.AssetBalance({
      balance: params.balance,
      unspent: inputTxs,
      spent: [],
      unconfirmed: []
    });
    balance.net = this.Account.isTestNet ? 'TestNet' : 'MainNet';
    balance.address = this.Account.address;
    balance.assetSymbols = [params.assetSymbol];
    balance.assets[params.assetSymbol] = assetBalance;
    let out = Neon.tx.createTransactionOutput(params.assetSymbol, params.amount, params.to);
    outputs.push(out);

    let tx = Neon.tx.default.create.contractTx(balance, outputs);
    let transaction = Neon.tx.signTransaction(tx, this.Account.keyPair.privateKey.toString('hex'));
    let serialized = Neon.tx.serializeTransaction(transaction);
    return serialized;
  }

  /**
 * @param  {String} contractAddress       (required) Adddress smart contract
 * @param  {String} to                    (required) Adddress receiver
 * @param  {Number} amount                (required) Amount token/coin
 * @param  {Number} decimal=Constant.NEO.GASDecimal
 * @returns {String}  
 */
  async  _createTransferTx(contractAddress, to, amount, decimal = Constant.NEO.GASDecimal) {

    let net = this.Account.isTestNet ? 'TestNet' : 'MainNet';
    let balanceAsset = await this.getBalance(Constant.NEO.GASAssetId);
    let balanceGAS = balanceAsset.assets[0].balance;
    let gasListUnspend = await this._getUnspendList(Constant.NEO.GASAssetId);
    let preTransferAmount = parseFloat(new BigNumber(amount).times(decimal));

    let _scriptHash =
      contractAddress.length === 40
        ? contractAddress
        : contractAddress.slice(2, contractAddress.length);

    let fromAddrScriptHash = Neon.wallet.getScriptHashFromAddress(this.Account.address);
    let toAddrScriptHash = Neon.u.reverseHex(Neon.wallet.getScriptHashFromAddress(to));

    let invoke = {
      scriptHash: _scriptHash,
      operation: 'transfer',
      args: [Neon.u.reverseHex(fromAddrScriptHash), toAddrScriptHash, preTransferAmount]
    };

    let balances = new Neon.wallet.Balance({
      address: this.Account.address,
      net: net
    });


    balances.addAsset('GAS', {
      balance: balanceGAS,
      unspent: gasListUnspend
    });

    const intents = [
      {
        assetId: Constant.NEO.GASAssetId,
        value: 0.00000001,
        scriptHash: fromAddrScriptHash
      }
    ];

    let unsignedTx = Neon.tx.Transaction.createInvocationTx(balances, intents, invoke, 0, { version: 1 });
    let signedTX = Neon.tx.signTransaction(unsignedTx, this.Account.keyPair.privateKey.toString('hex'));
    let hxTx = Neon.tx.serializeTransaction(signedTX);
    return hxTx;
  }

  async _createClaimTx() {
    let inputTxs = [];
    let claimable = await this.getClaimable();

    let listUnspent = claimable.transactions;
    for (let i = 0; i < listUnspent.length; i++) {
      let unspent = {};
      if (listUnspent[i].tx_id.slice(0, 2) === '0x') {
        unspent = {
          claim: listUnspent[i].unclaimed,
          txid: listUnspent[i].tx_id.slice(2),
          index: listUnspent[i].vout
        };
      } else {
        unspent = {
          claim: listUnspent[i].unclaimed,
          txid: listUnspent[i].tx_id,
          index: listUnspent[i].vout
        };
      }

      inputTxs.push(unspent);
    }
    var claimData = {
      claims: inputTxs
    };
    let tx = Neon.tx.default.create.claimTx(this.Account.address, claimData);
    let transaction = Neon.tx.signTransaction(tx, this.Account.keyPair.privateKey.toString('hex'));
    let result = Neon.tx.serializeTransaction(transaction);
    return result;
  }

  async _getUnspendList(assetId) {
    let inputTxs = [];

    let result = await this.CoinApi.getUtxo(this.Account.address, assetId);
    if (result.cd != 0) {
      return inputTxs;
    }
    let listUnspent = result.data.transactions;

    for (let i = 0; i < listUnspent.length; i++) {
      let unspent = {};
      if (listUnspent[i].tx_id.slice(0, 2) === '0x') {
        unspent = {
          value: listUnspent[i].amount,
          txid: listUnspent[i].tx_id.slice(2),
          index: listUnspent[i].vout
        };
      } else {
        unspent = {
          value: listUnspent[i].amount,
          txid: listUnspent[i].tx_id,
          index: listUnspent[i].vout
        };
      }

      inputTxs.push(Neon.wallet.Coin(unspent));
    }

    return inputTxs;
  }
}

module.exports = NeoWallet;