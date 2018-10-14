const { NeoWallet, CoinType } = require('../index');
const ConfigTest = require('./config/config.test.staging.testnet');
const InfinitoApi = require('node-infinito-api');
const Assert = require('assert');
const chai = require('chai');
chai.should();

const opts = {
  apiKey: ConfigTest.API_KEY,
  secret: ConfigTest.SECRECT,
  baseUrl: ConfigTest.BASE_URL,
  logLevel: ConfigTest.LOG_LEVEL,
  coinType: CoinType.NEO.symbol,
  isTestNet: true,
  privateKey: 'L3uKA9vRFoFzLE2M9i4M846QtFsVcPGJtzyLPbfcxn2gRArcS2dz'
  // APtUVHSAEchsCd6HPrmWXKAK7SETxhAvjU
};

// KwmJq28J4mXJ81Fxszk3zn3Cwm1oaHct6ng1ADJwNHRSoMwZ3F5b
// ASe43ZxsveYDhVEt2SYtRXRNtx17QZEu9C

var wallet = null;

describe('wallet.neo', async () => {

  beforeEach(async () => {
    let api = new InfinitoApi(opts);
    wallet = new NeoWallet(opts);
    wallet.setApi(api);
  });

  describe('#getBalance()', async () => {
    it('Get balance', async () => {
      let result = await wallet.getBalance('c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b');
      Assert.ok(result.assets !== undefined, 'balance must be exist');
    });
  });

  describe('#getHistory()', async () => {
    it('Get history', async () => {
      let result = await wallet.getHistory(0, 10);
      Assert.ok(result.transactions !== undefined, 'history must be exist');
    });
  });

  describe('#getClaimable()', async () => {
    it('Get Claimable', async () => {
      let result = await wallet.getClaimable();
      Assert.ok(result.transactions !== undefined, 'transactions must be exist');
    });
  });

  describe('#getUnclaimed()', async () => {
    it('Get UnClaimable', async () => {
      let result = await wallet.getUnclaimed();
      Assert.ok(result.available !== undefined, 'available must be exist');
    });
  });


  describe('#createRawTx()', async () => {
    it('createRawTx', async () => {
      let result = await wallet.createRawTx({
        to: 'APtUVHSAEchsCd6HPrmWXKAK7SETxhAvjU',
        amount: 1,
        assetId: 'c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b',
        assetSymbol: 'NEO'
      })
      Assert.ok(result !== '', 'tx_hex must be exist');
    });
  });

  describe('#send()', async () => {
    it('Send', async () => {
      let result = await wallet.send({
        txParams: {
          to: 'APtUVHSAEchsCd6HPrmWXKAK7SETxhAvjU',
          amount: 1,
          assetId: 'c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b',
          assetSymbol: 'NEO'
        }
      });
      Assert.ok(result.tx_id !== undefined, 'tx_id must be exist');
    });
  });

  describe('#transfer()', async () => {
    it('transfer', async () => {
      let result = await wallet.transfer('0x025c91e6f6792e087feebb30fd4761f4fbcb4e82', 'ASe43ZxsveYDhVEt2SYtRXRNtx17QZEu9C', 1);
      Assert.ok(result.tx_id !== undefined, 'tx id must be exist');
    });
  });

  describe('#claim()', async () => {

    it('transfer', async () => {
      let result = await wallet.claim();
      Assert.ok(result.tx_id !== undefined, 'tx id must be exist');
    });
  });
});

