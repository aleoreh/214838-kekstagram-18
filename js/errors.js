'use strict';

(function () {
  var errorsTemplate = document.querySelector('#error');
  var errorsContents = errorsTemplate.content.querySelector('.error');
  var mainElement = document.querySelector('main');

  var hide = function (contentsElement, onContinue) {
    mainElement.removeChild(contentsElement);
    onContinue();
  };

  var show = function (message, onContinue) {
    var contentsElement = errorsContents.cloneNode(true);

    contentsElement.querySelector('.error__title').textContent = message;

    mainElement.appendChild(contentsElement);

    var buttons = contentsElement.querySelectorAll('.error__button');

    var tryAgainButton = buttons[0];
    tryAgainButton.addEventListener('click', function () {
      hide(contentsElement, onContinue);
    });

    var tryAnotherButton = buttons[1];
    tryAnotherButton.disabled = true;
  };

  window.errors = {
    show: show
  };
})();
