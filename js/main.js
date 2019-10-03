'use strict';

var init = function () {
  window.pictures.show();
  window.editor.setup();
  window.fileLoader.setup(window.common.onLoaderChange(window.editor));
};

init();
