'use strict';

(function () {
  var getPictures = function (onSuccess, onError) {
    window.httpClient.get(window.common.BASE_URL + 'data', onSuccess, onError);
  };

  window.data = {
    getPictures: getPictures
  };
})();
