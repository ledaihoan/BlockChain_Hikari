const networks = {
  dash: {
    messagePrefix: '\x19Dash Signed Message:\n',
    bip32: {
      public: 0x02FE52F8,
      private: 0x02FE52CC
    },
    pubKeyHash: 0x4C,
    scriptHash: 0x10,
    wif: 0xCC,
    dustThreshold: 5460 // https://github.com/dashpay/dash/blob/master/src/primitives/transaction.h
  },
  dashTestnet: {
    messagePrefix: '\x19Dash Signed Message:\n',
    bip32: {
      public: 0x02FE52F8,
      private: 0x02FE52CC
    },
    pubKeyHash: 140,
    scriptHash: 19,
    wif: 0xCC,
    dustThreshold: 5460 // https://github.com/dashpay/dash/blob/master/src/primitives/transaction.h
  },
  dogecoin: {
    messagePrefix: '\x19Dogecoin Signed Message:\n',
    bip32: {
      public: 0x02facafd,
      private: 0x02fac398
    },
    pubKeyHash: 0x1e,
    scriptHash: 0x16,
    wif: 0x9e,
    dustThreshold: 0 // https://github.com/dogecoin/dogecoin/blob/v1.7.1/src/core.h#L155-L160
  },
  dogecoinTestnet: {
    messagePrefix: '\x19Dogecoin Signed Message:\n',
    bip32: {
      public: 0x02facafd,
      private: 0x02fac398
    },
    pubKeyHash: 0x71,
    scriptHash: 0xc4,
    wif: 0x9e,
    dustThreshold: 0 // https://github.com/dogecoin/dogecoin/blob/v1.7.1/src/core.h#L155-L160
  },
  litecoin: {
    messagePrefix: '\x19Litecoin Signed Message:\n',
    bip32: {
      public: 0x019da462,
      private: 0x019d9cfe
    },
    pubKeyHash: 0x30,
    scriptHash: 0x32,
    wif: 0xb0
  },
  litecoinTestnet: {
    messagePrefix: '\x18Litecoin Signed Message:\n',
    bip32: {
      public: 0x0436ef7d,
      private: 0x0436f6e1
    },
    pubKeyHash: 0x6f,
    scriptHash: 0xc4,
    wif: 0xef,
    dustThreshold: 100000
  }
};

module.exports = networks;