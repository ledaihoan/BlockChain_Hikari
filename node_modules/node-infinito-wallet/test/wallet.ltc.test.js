const { Wallet, CoinType } = require('../index');
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
  coinType: CoinType.LTC.symbol,
  isTestNet: true,
  // privateKey: 'cNAxZ8z4yMeRUuqXGTnZ5dPsMYQayA1LEsJQYAZn4veqxMt7jPSM'
  // QiqbgFSAmKEC9ws3oanCiTsmiiwDq74Thb 
  //  mxmf2VYt6L9YzbzaQzBpr7WTcyQV4L434Q
};

var wallet = null;

describe('wallet.ltc', async () => {

  beforeEach(async () => {
    let api = new InfinitoApi(opts);
    wallet = new Wallet(opts);
    wallet.setApi(api);
  });

  describe('#getBalance()', async () => {
    it('Get balance', async () => {
      let result = await wallet.getBalance();
      console.log('result', result);
      Assert.ok(result.balance !== undefined, 'balance must be exist');
      Assert.ok(result.unconfirmed_balance !== undefined, 'unconfirmed_balance must be exist');
    });
  });

  describe('#getHistory()', async () => {
    it('Get history', async () => {
      let result = await wallet.getHistory(0, 10);
      console.log('result', result);
      Assert.ok(result.txs !== undefined, 'history must be exist');
    });
  });

  describe('#getAddress()', async () => {
    it('Get address', () => {
      let result = wallet.getAddress();
      console.log('getAddress', result);
      Assert.ok(result !== undefined, 'address must be exist');
    });
  });

  describe('#getFeeRate()', async () => {
    it('get FeeRate', async () => {
      let result = await wallet.getDefaultFee();
      console.log('getFeeRate', result);
      Assert.ok(result !== undefined, 'address must be exist');
    });
  });

  describe('#send()', async () => {
    it.only('Send', async () => {
      let result = await wallet.send({
        txParams: {
          to: 'mrekeohAmra9GtJdAGkZTqQkzUzHSVKWA5',
          // f048911646960d35c693ae21a3c10dfe2498de9c66b9ca6ab63b2a1d56920fee
          amount: 10
        }
      });
      console.log('Send', result);
      Assert.ok(result.raw !== undefined, 'raw must be exist');
    });
  });
});