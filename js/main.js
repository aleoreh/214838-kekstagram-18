'use strict';

var init = function () {
  window.httpClient.get(
      window.httpClient.BASE_URL + 'data',
      function onSuccess(pictures) {
        window.state.pictures = pictures;
        window.pictures.show(pictures);
        window.editor.setup();
        window.fileLoader.setup(window.common.onLoaderChange(window.editor));
        window.imgFilters.show();
      },
      function onError(err) {
        window.errors.show(err, function () {
          window.location.reload();
        });
      });
};

init();
