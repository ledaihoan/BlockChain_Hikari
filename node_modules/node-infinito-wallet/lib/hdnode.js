const Bip39 = require('bip39');
const Bip32 = require('bip32');
const BIP44 = require('bip44-constants');
const Util = require('util');
const {
  AppError
} = require('node-infinito-util');
const Messages = require('./messages');
const CoinType = require('./coin_type');

class HDNode {
  /**
   * @constructor
   * @param  {String}  options.mnemonic        (optional) mnemonic 
   * @param  {String}  options.hdPath          (optional) hdPath (based on standard BIP44)
   */
  constructor(options) {
    if (options) {
      this.mnemonic = options.mnemonic;
      this.hdPath = options.hdPath;
    }
  }


  /**
   * @param  {String} coinType      (required) Coin type (BTC|BCH...)
   * @returns {Number}  coin index
   */
  getCoinIndexBip44(coinType) {
    if (coinType == 'TESTNET')
      return 1;
    return BIP44[coinType] - BIP44['BTC'];
  }

  /**
   * @param  {String}  coinType                (required) Coin type (BTC|BCH...)
   * @param  {Number}  index                   (optional) index (based on standard BIP44)
   * @param  {Boolean} isTestNet=false         (optional) Environment type (default = false))
   */
  generateKeyPair(coinType, index, isTestNet) {
    let network = HDNode.getNetwork(coinType, isTestNet);
    if (!this.hdPath) {
      let coinIndex = isTestNet ? this.getCoinIndexBip44('TESTNET') : this.getCoinIndexBip44(coinType.toUpperCase());
      if (!coinIndex) {
        throw new AppError(Util.format(Messages.invalid_cointype.message, coinType), Messages.invalid_cointype.code);
      }
      if (!index) {
        index = 0;
      }
      this.hdPath = "m/44'/" + coinIndex + "'/0'/0/" + index;
    }
    if (!this.mnemonic)
      this.mnemonic = this.generateMnomenic();
    let seed = this.mnemonicToSeed(this.mnemonic);
    let masterKeyPair = this.createMasterKeyPair(seed, network);
    this.keypair = this.createHDKeyPair(masterKeyPair, this.hdPath);
  }


  /**
   * get hdpath
   * @returns {String}
   */
  getHDPath() {
    return this.hdPath;
  }
  /**
   * get wif
   * @returns {String}
   */
  getWif() {
    return this.keypair.toWIF();
  }

  /**
   * @returns {Buffer}
   */
  getPublicKey() {
    return this.keypair.publicKey;
  }

  /**
   * @returns {Buffer}
   */
  getPrivateKey() {
    return this.keypair.privateKey;
  }


  /**
   * @returns {String}
   */
  getMnemonic() {
    return this.mnemonic;
  }

  /**
  * @returns {String}
  */
  generateMnomenic() {
    return Bip39.generateMnemonic();
  }

  /**
   * @param  {String} mnemonic          (required) mnemonic
   */
  mnemonicToSeed(mnemonic) {
    return Bip39.mnemonicToSeed(mnemonic);
  }


  /** 
   * @param  {String} seed              (required) seed
   * @param  {Object} network           (required) Type network in networks.js           
   */
  createMasterKeyPair(seed, network) {
    return Bip32.fromSeed(seed, network);
  }


  /**
   * @param  {String}  master              (required) master
   * @param  {String}  hdPath              (required) index (based on standard BIP44)
   * @returns {Object} Keypair
   */
  createHDKeyPair(master, hdPath) {
    return master.derivePath(hdPath);
  }
  /**
   * @static
   * @param   {String}  coinType          (required) Coin type (BTC|BCH...)
   * @param   {Boolean} isTestnet         (optional) Environment type (default = false))
   * @returns {Object}  Type network in networks.js 
   */
  static getNetwork(coinType, isTestnet = false) {
    let network;
    switch (coinType) {
      case CoinType.BTC.symbol:
        {
          network = isTestnet ? CoinType.BTC.network.testnet : CoinType.BTC.network.mainnet;
          break;
        }
      case CoinType.BCH.symbol:
        {
          network = isTestnet ? CoinType.BCH.network.testnet : CoinType.BCH.network.mainnet;
          break;
        }
      case CoinType.ETC.symbol:
      case CoinType.ETH.symbol:
        {
          network = CoinType.BTC.network.mainnet;
          break;
        }
      case CoinType.NEO.symbol:
        {
          network = CoinType.BTC.network.mainnet;
          break;
        }
      case CoinType.LTC.symbol:
        {
          network = isTestnet ? CoinType.LTC.network.testnet : CoinType.LTC.network.mainnet;
          break;
        }
      case CoinType.DASH.symbol:
        {
          network = isTestnet ? CoinType.DASH.network.testnet : CoinType.DASH.network.mainnet;
          break;
        }
      case CoinType.DOGE.symbol:
        {
          network = isTestnet ? CoinType.DOGE.network.testnet : CoinType.DOGE.network.mainnet;
          break;
        }
    }

    return network;
  }
}

module.exports = HDNode;