'use strict';

(function () {
  var formElement = document.querySelector('.img-upload__form');
  var rootElement = formElement.querySelector('.img-upload__overlay');
  var imageUploadPreviewElement = rootElement.querySelector('.img-upload__preview');

  var effectRadioElements = rootElement.querySelectorAll('input[name="effect"]');
  var effectLevelValueElement = rootElement.querySelector('.effect-level__value');
  var effectLevelPinElement = rootElement.querySelector('.effect-level__pin');
  var effectLevelDepthElement = rootElement.querySelector('.effect-level__depth');

  var hashtagInputElement = rootElement.querySelector('.text__hashtags');

  var setupPinDrag = function () {
    effectLevelPinElement.addEventListener('mousedown', pinGrabHandler);
  };

  var setup = function () {
    effectRadioElements.forEach(function (elem) {
      elem.addEventListener('click', editorEffectsRadioClickHandler);
    });

    hashtagInputElement.addEventListener('input', editorHashtagInputHandler);

    setupPinDrag();
  };

  var pinGrabHandler = function (ev) {
    ev.preventDefault();
    var coords = {
      x: ev.clientX,
    };
    var parentBoundingRect = ev.target.offsetParent.getBoundingClientRect();
    var parentRect = {
      minX: parentBoundingRect.left,
      maxX: parentBoundingRect.right,
      width: parentBoundingRect.width
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      var clientX = Math.max(Math.min(moveEvt.clientX, parentRect.maxX), parentRect.minX);
      var shift = {
        x: clientX - coords.x,
      };
      coords.x += shift.x;
      effectLevelPinElement.style.left = (effectLevelPinElement.offsetLeft + shift.x) + 'px';
      editorSetEffectLevel((coords.x - parentRect.minX) / parentRect.width * 100);
    };

    var onMouseUp = function (upEv) {
      upEv.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);


  };

  var editorCloseButtonClickHandler = function () {
    hide(window.onEditorClose);
  };

  var editorKeyDownEventHandler = function (ev) {
    if (ev.keyCode === window.common.ESC_KEYCODE && ev.target !== hashtagInputElement) {
      hide(window.onEditorClose);
    }
  };

  var editorEffectsRadioClickHandler = function (ev) {
    effectRadioElements.forEach(function (elem) {
      if (elem === ev.target) {
        elem.checked = true;
        editorSetEffectLevel();
      }
    });
  };
  var editorHashtagInputHandler = function (ev) {
    var hashtagsElement = formElement.querySelector('.text__hashtags');
    var validation = window.hashtags.validate(hashtagsElement.value);

    if (validation.result === 'Ok') {
      hashtagInputElement.setCustomValidity('');
      return;
    }

    ev.preventDefault();
    var validity = validation.errors.reduce(function (prev, cur) {
      return prev.concat('; ', cur);
    });
    hashtagInputElement.setCustomValidity(validity);
  };

  var editorGetSelectedEffect = function () {
    var checkedEffect = Array.from(effectRadioElements).find(function (elem) {
      return elem.checked;
    });
    return checkedEffect.value;
  };

  var editorSetEffectLevel = function (level) {
    var appliedLevel = Math.round(level) || effectLevelValueElement.value;
    var cssFilter = window.editorHelpers.imageEffects[editorGetSelectedEffect()](appliedLevel);

    effectLevelValueElement.value = appliedLevel;
    // effectLevelPinElement.style.left = appliedLevel.toString() + '%';
    effectLevelDepthElement.style.width = appliedLevel.toString() + '%';
    imageUploadPreviewElement.querySelector('img').style.filter = cssFilter;
  };

  var show = function () {
    rootElement.classList.remove(window.common.CSS_HIDDEN_CLASS);

    var closeButton = rootElement.querySelector('#upload-cancel');
    closeButton.addEventListener('click', editorCloseButtonClickHandler);

    document.addEventListener('keydown', editorKeyDownEventHandler);
  };

  var hide = function () {
    rootElement.removeEventListener('click', editorCloseButtonClickHandler);
    document.removeEventListener('keydown', editorKeyDownEventHandler);
    rootElement.classList.add(window.common.CSS_HIDDEN_CLASS);
    window.common.onEditorClose();
  };

  window.editor = {
    setup: setup,
    hide: hide,
    show: show,
  };
})();

