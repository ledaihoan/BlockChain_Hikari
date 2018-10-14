const CoinType = require('../coin_type');
const BitcoinAccount = require('./bitcoin');
const EthAccount = require('./eth');
const NeoAccount = require('./neo');
const BitcoinCashAccount = require('./bitcoincash');

const {
  AppError
} = require('node-infinito-util');
const Messages = require('../messages');
const Util = require('util');

class Account {

  /**
   * @constructor
   * @param  {Object}  options
   * @param  {String}  options.privateKey      (optional) coin's private key or WIF 
   * @param  {String}  options.mnemonic        (optional) mnemonic 
   * @param  {String}  options.hdPath          (optional) hdPath (based on standard BIP44)
   * @param  {Number}  options.index           (optional) index (based on standard BIP44)
   * @param  {String}  options.coinType        (required) Coin type
   * @param  {Boolean} options.isTestNet       (optional) Environment type (default = false))
   */
  constructor(options) {
    let account;
    switch (options.coinType) {
      case CoinType.BTC.symbol:
      case CoinType.DOGE.symbol:
      case CoinType.LTC.symbol:
      case CoinType.DASH.symbol:
        {
          account = new BitcoinAccount(options);
          break;
        }
      case CoinType.BCH.symbol:
        {
          account = new BitcoinCashAccount(options);
          break;
        }
      case CoinType.ETH.symbol:
      case CoinType.ETC.symbol:
        {
          account = new EthAccount(options);
          break;
        }
      case CoinType.NEO.symbol:
        {
          account = new NeoAccount(options);
          break;
        }
      default:
        {
          throw new AppError(Util.format(Messages.invalid_cointype.message, options.coinType), Messages.invalid_cointype.code);
        }
    }

    if (!account) {
      throw Error('Don\'t exists account type');
    }
    return account;
  }
}


module.exports = Account;