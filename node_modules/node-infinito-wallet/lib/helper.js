var BigNumber = require('bignumber.js');

class Helper {

  /**
   * @static
   * @param  {Number} amount
   * @returns {Number} santoshi
   */
  static convertToSatoshi(amount) {
    return parseFloat((amount * 100000000).toFixed(0));
  }
  /**
   * @static
   * @param  {Number} amount
   * @returns {Number} Bitcoin
  */
  static convertToBitcoin(amount) {
    return parseFloat(amount / 100000000);
  }

  /**
    * Convert ETH to Wei
    * @param  {float} value
    * @return {string} hex value (wei)
    */
  static convertEthToWei(value) {
    return '0x' + new BigNumber(value).times(1000000000000000000).toString(16);
  }
}

module.exports = Helper;