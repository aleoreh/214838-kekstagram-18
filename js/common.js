'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var CSS_HIDDEN_CLASS = 'hidden';

  var onEditorClose = function () {
    return window.fileLoader.reset();
  };

  var onLoaderChange = function () {
    return function () {
      window.editor.show(onEditorClose);
    };
  };

  window.common = {
    ESC_KEYCODE: ESC_KEYCODE,
    CSS_HIDDEN_CLASS: CSS_HIDDEN_CLASS,
    onEditorClose: onEditorClose,
    onLoaderChange: onLoaderChange,
  };
})();
