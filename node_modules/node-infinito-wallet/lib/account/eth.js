const EthWallet = require('ethereumjs-wallet');
const Keychain = require('../keychain');
const { AppError } = require('node-infinito-util');
const Util = require('util');
const Messages = require('../messages');
const EthUtil = require('ethereumjs-util');
const HdNode = require('../hdnode');

class EthAccount {

  /**
  * @constructor
  * @param  {Object}  options
  * @param  {String}  options.privateKey      (optional) coin's private key or WIF 
  * @param  {String}  options.mnemonic        (optional) mnemonic 
  * @param  {String}  options.hdPath          (optional) hdPath (based on standard BIP44)
  * @param  {Number}  options.index           (optional) index (based on standard BIP44)
  * @param  {String}  options.coinType        (required) Coin type (ETH|ETC))
  * @param  {Boolean} options.isTestNet       (optional) Environment type (default = false))
  */
  constructor(options) {
    if (!options) {
      throw new AppError(Util.format(Messages.missing_parameter.message, 'options'), Messages.missing_parameter.code);
    }

    if (options.privateKey) {
      this.privateKey = options.privateKey;
    } else {
      let keys = Keychain.getKeyPairFromPassPhrase({
        mnemonic: options.mnemonic,
        hdPath: options.hdPath,
        coinType: options.coinType,
        index: options.index,
        isTestNet: options.isTestNet
      });
      this.privateKey = keys.privateKey;
    }

    this.coinType = options.coinType;
    let result = generateAccount(this.privateKey, this.coinType, options.isTestNet);
    Object.assign(this, result);
  }
}

/**
 * @param  {String}  privateKey              (required) coin's private key
 * @param  {Number}  coinType                (required) Coin type
 * @param  {Boolean} isTestNet=false         (optional) Environment type (default = false))
 */
function generateAccount(privateKey, coinType, isTestNet = false) {
  let network = HdNode.getNetwork(coinType, isTestNet);
  let ethWallet = EthWallet.fromPrivateKey(EthUtil.toBuffer(privateKey));
  return {
    address: ethWallet.getAddressString(),
    privateKey: ethWallet.getPrivateKeyString(),
    publicKey: ethWallet.getPublicKeyString(),
    isTestNet: isTestNet,
    network: network
  };
}

module.exports = EthAccount;