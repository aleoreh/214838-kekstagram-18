'use strict';

var init = function () {
  window.data.getPictures(
      function onSuccess(pictures) {
        window.pictures.show(pictures);
        window.editor.setup();
        window.fileLoader.setup(window.common.onLoaderChange(window.editor));
      },
      function onError(err) {
        window.errors.show(err);
      });
};

init();
