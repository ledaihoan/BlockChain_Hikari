const Bitcoinjs = require('bitcoinjs-lib');
const Networks = require('./networks');

const coinType = {
  BTC: {
    symbol: 'BTC',
    coin: 'Bitcoin',
    network: {
      mainnet: Bitcoinjs.networks.bitcoin,
      testnet: Bitcoinjs.networks.testnet
    }
  },
  BCH: {
    symbol: 'BCH',
    coin: 'Bitcoin Cash',
    network: {
      mainnet: Bitcoinjs.networks.bitcoin,
      testnet: Bitcoinjs.networks.testnet
    }
  },
  LTC: {
    symbol: 'LTC',
    coin: 'Litecoin',
    network: {
      mainnet: Networks.litecoin,
      testnet: Networks.litecoinTestnet
    }
  },
  DOGE: {
    symbol: 'DOGE',
    coin: 'Dogecoin',
    network: {
      mainnet: Networks.dogecoin,
      testnet: Networks.dogecoinTestnet
    }
  },
  DASH: {
    symbol: 'DASH',
    coin: 'Dash',
    network: {
      mainnet: Networks.dash,
      testnet: Networks.dashTestnet
    }
  },
  ETH: {
    symbol: 'ETH',
    coin: 'Ether',
    network: {
      mainnet: {},
      testnet: {}
    }
  },
  ETC: {
    symbol: 'ETC',
    coin: 'Ether Classic',
    network: {
      mainnet: {},
      testnet: {}
    }
  },
  RSK: {
    symbol: 'RSK',
    coin: 'RSK',
    network: {
      mainnet: {},
      testnet: {}
    }
  },
  EOS: {
    symbol: 'EOS',
    coin: 'EOS',
    network: {
      mainnet: {},
      testnet: {}
    }
  },
  NEO: {
    symbol: 'NEO',
    coin: 'NEO',
    network: {
      mainnet: {},
      testnet: {}
    }
  },
  ADA: {
    symbol: 'ADA',
    coin: 'Cardano',
    network: {
      mainnet: {},
      testnet: {}
    }
  }
};

module.exports = coinType;