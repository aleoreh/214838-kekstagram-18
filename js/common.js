'use strict';

(function () {
  window.ESC_KEYCODE = 27;
  window.CSS_HIDDEN_CLASS = 'hidden';

  var onEditorClose = function () {
    return window.fileLoader.reset();
  };

  var onLoaderChange = function () {
    return function () {
      window.editor.show(onEditorClose);
    };
  };

  window.common = {
    onEditorClose: onEditorClose,
    onLoaderChange: onLoaderChange,
  }
})();
