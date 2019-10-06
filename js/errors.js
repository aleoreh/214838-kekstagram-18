'use strict';

(function () {
  var errorsTemplate = document.querySelector('#error');
  var errorsContents = errorsTemplate.content.querySelector('.error');
  var mainElement = document.querySelector('main');

  var show = function (message) {
    var contentsElement = errorsContents.cloneNode(true);
    contentsElement.querySelector('.error__title').textContent = message;
    mainElement.appendChild(contentsElement);
  };

  window.errors = {
    show: show
  };
})();
