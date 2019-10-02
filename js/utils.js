'use strict';

(function () {
  /**
 * Generates random int number from 0 to (maxBound - 1)
 * @param {number} maxBound maximal int number to generate
 * @return {number} random int number from 0 to maxBound
 */
  var randomInt = function (maxBound) {
    return Math.floor(Math.random() * maxBound);
  };

  /**
   * Generates a sequence of numbers from 0 to n
   * @param {number} n maximal number in generated range
   * @return {Array<number>} [0, 1, ..., n]
   */
  var range = function (n) {
    var res = [];
    for (var i = 0; i < n; i++) {
      res.push(i);
    }
    return res;
  };

  /**
   * Converts array to set (removes duplicate elements from array)
   * @param {Array} array Any array you want to convert into a set
   * @return {Array} array
   */
  var arrayToSet = function (array) {
    return array.filter(function (v, i) {
      return array.indexOf(v) === i;
    });
  };

  /**
   * Generates css function from name and value
   * @param {string} name CSS function name
   * @param {any} value Value for the function
   * @return {string} A string rendered as css function
   */
  var cssFunction = function (name, value) {
    return name + '(' + value + ')';
  };

  window.utils = {
    range: range,
    arrayToSet: arrayToSet,
    cssFunction: cssFunction,
    randomInt: randomInt,
  };
})();
