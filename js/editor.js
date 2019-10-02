'use strict';

(function () {
  var form = document.querySelector('.img-upload__form');
  var element = form.querySelector('.img-upload__overlay');
  var imageUploadPreviewElement = element.querySelector('.img-upload__preview');

  var effectRadioElements = element.querySelectorAll('input[name="effect"]');
  var effectLevelValueElement = element.querySelector('.effect-level__value');
  var effectLevelPinElement = element.querySelector('.effect-level__pin');
  var effectLevelDepthElement = element.querySelector('.effect-level__depth');

  var hashtagInputElement = element.querySelector('.text__hashtags');

  var setup = function () {
    var effectLevelLineElement = element.querySelector('.effect-level__line');
    effectLevelLineElement.addEventListener('mouseup', editorEffectLevelLineClickHandler);

    effectRadioElements.forEach(function (elem) {
      elem.addEventListener('click', editorEffectsRadioClickHandler);
    });

    hashtagInputElement.addEventListener('input', editorHashtagInputHandler);
  };

  var editorCloseButtonClickHandler = function () {
    hide(window.onEditorClose);
  };

  var editorKeyDownEventHandler = function (ev) {
    if (ev.keyCode === window.ESC_KEYCODE && ev.target !== hashtagInputElement) {
      hide(window.onEditorClose);
    }
  };

  var editorEffectLevelLineClickHandler = function (ev) {
    var lineWidth = ev.currentTarget.offsetWidth;
    var mouseX = ev.offsetX;
    editorSetEffectLevel(lineWidth !== 0 ? mouseX * 100 / lineWidth : 0);
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
    var hashtagsElement = form.querySelector('.text__hashtags');
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
    effectLevelPinElement.style.left = appliedLevel.toString() + '%';
    effectLevelDepthElement.style.width = appliedLevel.toString() + '%';
    imageUploadPreviewElement.querySelector('img').style.filter = cssFilter;
  };

  var show = function () {
    element.classList.remove(window.CSS_HIDDEN_CLASS);

    var closeButton = element.querySelector('#upload-cancel');
    closeButton.addEventListener('click', editorCloseButtonClickHandler);

    document.addEventListener('keydown', editorKeyDownEventHandler);
  };

  var hide = function () {
    element.removeEventListener('click', editorCloseButtonClickHandler);
    document.removeEventListener('keydown', editorKeyDownEventHandler);
    element.classList.add(window.CSS_HIDDEN_CLASS);
    window.common.onEditorClose();
  };

  window.editor = {
    setup: setup,
    hide: hide,
    show: show,
  };
})();

