const Messages = require('./messages');
const Util = require('util');
const {
  AppError,
  Logger
} = require('node-infinito-util');
const Account = require('./account');
const CoinType = require('./coin_type');
const Bitcoinjs = require('bitcoinjs-lib');
const coinSelect = require('coinselect');

class Wallet {

  /**
 * @constructor
 * @param  {Object}  options
 * @param  {String}  options.privateKey      (optional) coin's private key or WIF 
 * @param  {String}  options.mnemonic        (optional) mnemonic 
 * @param  {String}  options.hdPath          (optional) hdPath (based on standard BIP44)
 * @param  {Number}  options.index           (optional) index (based on standard BIP44)
 * @param  {String}  options.coinType        (required) Coin type (BTC|BCH...)
 * @param  {Boolean} options.isTestNet       (optional) Environment type (default = false))
 */
  constructor(options) {
    this._check(options);
    if (!options.coinType) {
      options.coinType = CoinType.BTC.symbol;
    }

    this.Account = new Account({
      mnemonic: options.mnemonic,
      hdPath: options.hdPath,
      privateKey: options.privateKey,
      coinType: options.coinType,
      index: options.index,
      isTestNet: options.isTestNet
    });

  }


  /**
   * @param  {Object} api           (required)  API is instanse of InfinitoApi
   */
  setApi(api) {
    this._api = api;
    this.CoinApi = this._api[this.Account.coinType];
  }
  /**
   * @returns {Object} API
   */
  getApi() {
    return this._api;
  }


  /**
   * Get balance wallet. Based on Coin will be return 'unconfirmed_balance'
   * @returns {Object} { balance: 0, unconfirmed_balance: 0 }
   */
  async getBalance() {
    let result = await this.CoinApi.getBalance(this.Account.address);
    return this._getReponse(result);
  }


  /**
   * Get transaction history.
   * List transaction based on coin. Example bitcoin 'xxx' is  txs. ETH  is  transactions
   * @param  {Number} offset
   * @param  {Number} limit
   * @returns {Object}   { total: 0, from: 0, to: -1, xxx: [] }
   */
  async getHistory(offset, limit) {
    let result = await this.CoinApi.getHistory(this.Account.address, offset, limit);
    return this._getReponse(result);
  }


  /**
   * @returns {String}
   */
  getAddress() {
    return this.Account.address;
  }


  /**
   * send transaction using rawTx if you have rawTx already or pass txParams in order to build rawTx. rawTx is priority
   * @param  {String}  {rawTx                  (optional)  raw transaction
   * @param  {String}  txParams.to             (required)  Address receiver
   * @param  {Number}  txParams.amount         (required)  Amount coin send to receiver (santoshi)
   * @param  {Number}  txParams.fee            (optional)  Fee per block that you want to pay for this transaction, if dont set you can use feeType. fee is priority than feeType
   * @param  {Number}  txParams.feeType        (optional)  Auto get fee transaction (low|medium|high).  default is medium
   * @param  {Boolean} isBroadCast=true }      (optional)  Send this transaction or just create raw
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
      if (!rawTxData.raw) {
        throw new AppError(Messages.create_crawtx_fail.message, Messages.create_crawtx_fail.code);
      }
      response = rawTxData;
    }

    if (isBroadCast) {
      let result = await this.CoinApi.sendTransaction({
        rawtx: response.raw
      });

      console.log('result', result);
      if (result.cd === 0) {
        return {
          tx_id: result.data.txid,
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
   * @param  {Object}  params                        (required)  Address receiver
   * @param  {String}  params.to                     (required)  Address receiver
   * @param  {Number}  params.amount                 (required)  Amount coin send to receiver (santoshi)
   * @param  {Number}  params.fee                    (optional)  Fee per block that you want to pay for this transaction, if dont set you can use feeType. fee is priority than feeType
   * @param  {Number}  params.feeType                (optional)  Auto get fee transaction (low|medium|high). default medium
   * @param  {Array[Object]}  params.listUnspent     (optional) List upspend
   * @returns {Object}  { raw: '',fee:100, error:''}
   */
  async createRawTx(params) {
    let defaultFee = await this.getDefaultFee(params.feeType);
    let feePerB = params.fee ? params.fee : defaultFee;
    const transaction = new Bitcoinjs.TransactionBuilder(this.Account.network);
    const targets = [{
      address: params.to,
      value: params.amount
    }];

    if (!params.listUnspent) {
      let listUnspent = await this.CoinApi.getUtxo(this.Account.address);
      if (listUnspent.cd !== 0) {
        return {
          raw: '',
          error: 'OVER_BALANCE'
        };
      }
      params.listUnspent = listUnspent.data.transactions;
    }
    const inputTxs = [];
    for (let i = 0; i < params.listUnspent.length; i++) {
      const unspent = {
        value: parseFloat(params.listUnspent[i].amount),
        txid: params.listUnspent[i].tx_id,
        output_no: params.listUnspent[i].vout
      };
      inputTxs.push(unspent);
    }

    const {
      inputs,
      outputs,
      fee
    } = coinSelect(inputTxs, targets, feePerB);
    if (!inputs || !outputs) {
      return {
        raw: '',
        fee,
        error: 'OVER_BALANCE'
      };
    }

    inputs.forEach(input => {
      transaction.addInput(input.txid, input.output_no);
    });

    outputs.forEach(output => {
      if (!(output.address && output.address.length > 0)) {
        output.address = this.Account.address;
      }
      transaction.addOutput(output.address, output.value);
    });

    for (let i = 0; i < inputs.length; i++) {
      transaction.sign(i, this.Account.keyPair);
    }

    let tx = transaction.build();
    return {
      raw: tx.toHex(),
      tx_id: tx.getId(),
      fee
    };
  }

  async getDefaultFee(feeType = 'medium') {
    let result = await this.CoinApi.getFeeRate();
    if (result.cd === 0) {
      return result.data[this.Account.coinType][feeType];
    }
    throw new AppError(result.msg, Messages.internal_error.code);
  }

  _check(options) {
    if (!options) {
      throw new AppError(Util.format(Messages.missing_parameter.message, 'options'), Messages.missing_parameter.code);
    }
  }

  _getReponse(response) {
    if (response.cd !== 0) {
      Logger.info(response);
      throw new AppError(JSON.stringify(response));
    }
    return response.data;
  }
}

module.exports = Wallet;