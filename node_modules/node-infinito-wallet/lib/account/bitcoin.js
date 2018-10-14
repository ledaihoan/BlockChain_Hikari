const Bitcoinjs = require('bitcoinjs-lib');
const Keychain = require('../keychain');
const {
  AppError
} = require('node-infinito-util');
const Util = require('util');
const Messages = require('../messages');
const HdNode = require('../hdnode');
const wif = require('wif');

class BitcoinAccount {

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
    let result = generateAccount(wifkey, network, options.isTestNet);
    Object.assign(this, result);
  }

}

/**
 * @param  {String}  privateKey              (required) coin's private key
 * @param  {Object}  network                 (required) coin's network
 * @param  {Boolean} isTestNet=false         (optional) Environment type (default = false))
 */
function generateAccount(privateKey, network, isTestNet = false) {
  let keyPair = Bitcoinjs.ECPair.fromWIF(privateKey, network);

  let { address } = Bitcoinjs.payments.p2pkh({
    pubkey: keyPair.publicKey,
    network: network
  });
  return {
    address,
    privateKey: keyPair.privateKey.toString('hex'),
    publicKey: keyPair.publicKey.toString('hex'),
    network,
    isTestNet,
    keyPair: keyPair
  };
}

module.exports = BitcoinAccount;