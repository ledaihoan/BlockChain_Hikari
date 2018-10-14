const {
  AppError
} = require('node-infinito-util');
const Util = require('util');
const Messages = require('../messages');
const HdNode = require('../hdnode');
const wif = require('wif');
const BitcoinCashjs = require('bitcoincashjs');
const Keychain = require('../keychain');

class BitcoinCashAccount {

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
    if (!options) {
      throw new AppError(Util.format(Messages.missing_parameter.message, 'options'), Messages.missing_parameter.code);
    }
    if (!options.isTestNet) {
      options.isTestNet = false;
    }

    let network = HdNode.getNetwork(options.coinType, options.isTestNet);
    let wifkey;
    if (options.privateKey) {
      wifkey = Keychain.getWif(options.privateKey, network);
    } else {
      let keys = Keychain.getKeyPairFromPassPhrase({
        mnemonic: options.mnemonic,
        hdPath: options.hdPath,
        coinType: options.coinType,
        index: options.index,
        isTestNet: options.isTestNet
      });

      wifkey = wif.encode(network.wif, keys.privateKey, true);
    }

    this.coinType = options.coinType;

    let result = generateAccount(wifkey, options.isTestNet);
    Object.assign(this, result);
  }
}

/**
 * @param  {String}  privateKey              (required) coin's private key
 * @param  {Object}  network                 (required) coin's network
 * @param  {Boolean} isTestNet = false       (optional) Environment type (default = false))
 */
function generateAccount(privateKey, isTestNet = false) {
  let network = isTestNet ? BitcoinCashjs.Networks.testnet : BitcoinCashjs.Networks.mainnet;
  let keyPair = new BitcoinCashjs.PrivateKey(privateKey, network);

  return {
    address: keyPair.toAddress().toString(),
    privateKey: keyPair.toString(),
    publicKey: keyPair._pubkey.toString(),
    network,
    isTestNet,
    keyPair: {
      privateKey: keyPair.toBuffer(),
      publicKey: keyPair._pubkey.toBuffer
    }
  };
}

module.exports = BitcoinCashAccount;