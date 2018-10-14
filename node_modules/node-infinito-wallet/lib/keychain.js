const HdNode = require('./hdnode');
const {
  AppError
} = require('node-infinito-util');
const Util = require('util');
const Messages = require('./messages');
const wif = require('wif');

class Keychain {
  /**
   * @static
   * @param  {Object}  params
   * @param  {String}  params.mnemonic        (optional) mnemonic 
   * @param  {String}  params.hdPath          (optional) hdPath (based on standard BIP44)
   * @param  {Number}  params.index           (optional) index (based on standard BIP44)
   * @param  {String}  params.coinType        (required) Coin type (BTC|BCH...)
   * @param  {Boolean} params.isTestNet       (optional) Environment type (default = false)
   * @returns {Object} return Keys {privateKey:'', publicKey:''}
   */
  static getKeyPairFromPassPhrase({
    mnemonic,
    hdPath,
    coinType,
    index,
    isTestNet
  }) {
    if (!coinType) {
      throw new AppError(Util.format(Messages.missing_parameter.message, 'coinType'), Messages.missing_parameter.code);
    }

    let node = new HdNode({
      mnemonic,
      hdPath
    });
    node.generateKeyPair(coinType, index, isTestNet);
    return {
      privateKey: node.getPrivateKey(),
      publicKey: node.getPublicKey()
    };
  }

  /**
   * @static
   * @param  {String} privateKey        (optional) coin's private key 
   * @param  {Object} network           (required) coin's network
   * @returns {String} wif
   */
  static getWif(privateKey, network) {
    try {
      wif.decode(privateKey);
      return privateKey;
    } catch (err) {
      return wif.encode(network.wif, new Buffer(privateKey, 'hex'), true);
    }
  }
}

module.exports = Keychain;