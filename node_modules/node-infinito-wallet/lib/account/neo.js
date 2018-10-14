const CoinType = require('../coin_type');
const Neon = require('@cityofzion/neon-js');
const Keychain = require('../keychain');
const {
  AppError
} = require('node-infinito-util');
const Util = require('util');
const Messages = require('../messages');
const HdNode = require('../hdnode');
const wif = require('wif');

class NeoAccount {

  /**
 * @constructor
 * @param  {Object}  options
 * @param  {String}  options.privateKey      (optional) coin's private key or WIF 
 * @param  {String}  options.mnemonic        (optional) mnemonic 
 * @param  {String}  options.hdPath          (optional) hdPath (based on standard BIP44)
 * @param  {Number}  options.index           (optional) index (based on standard BIP44)
 * @param  {String}  options.coinType        (required) Coin type (NEO)
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

    this.coinType = CoinType.NEO.symbol;
    let result = generateAccount(wifkey, network, options.isTestNet);
    Object.assign(this, result);
  }

  validateAddress(address) {
    return Neon.wallet.isAddress(address);
  }
}

/**
 * @param  {String}  privateKey              (required) coin's private key 
 * @param  {Boolean} isTestNet=false         (optional) Environment type (default = false))
 */
function generateAccount(privateKey, isTestNet = false) {
  let privateKeyBinary = Neon.wallet.getPrivateKeyFromWIF(privateKey);
  let publicKey = Neon.wallet.getPublicKeyFromPrivateKey(privateKeyBinary);
  let script = Neon.wallet.getScriptHashFromPublicKey(publicKey);
  let address = Neon.wallet.getAddressFromScriptHash(script);
  let decode = wif.decode(privateKey);

  return {
    address,
    privateKey,
    publicKey: publicKey,
    isTestNet: isTestNet,
    keyPair: {
      privateKey: decode.privateKey,
      publicKey: Buffer.from(publicKey, 'hex')
    }
  };
}

module.exports = NeoAccount;