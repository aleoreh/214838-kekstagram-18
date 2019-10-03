'use strict';

(function () {
  var rootElement = document.querySelector('#upload-file');

  var setup = function (onChange) {
    rootElement.onChange = null;
    rootElement.addEventListener('change', onChange);
  };

  var reset = function () {
    rootElement.value = '';
  };

  window.fileLoader = {
    setup: setup,
    reset: reset,
  };

})();
