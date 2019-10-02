'use strict';

(function () {
  var element = document.querySelector('#upload-file');

  var setup = function (onChange) {
    element.onChange = null;
    element.addEventListener('change', onChange);
  };

  var reset = function () {
    element.value = '';
  };

  window.fileLoader = {
    setup: setup,
    reset: reset,
  };

})();
