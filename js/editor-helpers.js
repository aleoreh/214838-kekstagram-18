'use strict';

// NOTE: Получилось несколько iife на модуль. Это нормально?

(function () {
  var MAX_BLUR_RADIUS_PX = 3;
  var MAX_BRIGHTNESS_VALUE = 3;

  var chrome = function (level) {
    return window.utils.cssFunction('grayscale', level / 100);
  };

  var sepia = function (level) {
    return window.utils.cssFunction('sepia', level / 100);
  };

  var marvin = function (level) {
    return window.utils.cssFunction('invert', level + '%');
  };

  var phobos = function (level) {
    return window.utils.cssFunction('blur', level * MAX_BLUR_RADIUS_PX / 100 + 'px');
  };

  var heat = function (level) {
    return window.utils.cssFunction('brightness', level * MAX_BRIGHTNESS_VALUE / 100);
  };

  var none = function () {
    return '';
  };

  window.editorHelpers = {
    imageEffects: {
      chrome: chrome,
      sepia: sepia,
      marvin: marvin,
      phobos: phobos,
      heat: heat,
      none: none
    }
  };
})();

(function () {
  var MAX_TAGS_COUNT = 5;
  var MAX_TAG_LENGTH = 20;

  var beginsWithHash = function (tag) {
    return tag.charAt(0) === '#';
  };

  var isNotOnlyHash = function (tag) {
    return tag !== '#';
  };

  var separatedOnlyBySpace = function (tag) {
    var match = tag.match(/#/g);
    return match && match.length === 1;
  };

  var noDuplicates = function (tags) {
    var loweredTags = tags.map(function (tag) {
      return tag.toLowerCase();
    });
    return loweredTags.length === window.utils.arrayToSet(loweredTags).length;
  };

  var fitsMaximumSize = function (tag, maxLength) {
    return tag.length <= maxLength;
  };

  var validateHashtag = function (hashtagsString) {
    var errors = [];

    var tags = hashtagsString.split(' ');

    if (tags.length > MAX_TAGS_COUNT) {
      errors.push('Должно быть не более ' + MAX_TAGS_COUNT + ' тэгов');
    }

    tags.forEach(function (tag) {
      if (tag === '') {
        return;
      }

      if (!beginsWithHash(tag)) {
        errors.push('Должен начинаться с #');
      }

      if (!isNotOnlyHash(tag)) {
        errors.push('Не должен состоять только из #');
      }

      if (!separatedOnlyBySpace(tag)) {
        errors.push('Тэги должны разделяться только пробелами');
      }

      if (!noDuplicates(tags)) {
        errors.push('Один и тот же тэг не может быть использован дважды (тэги нечувствительны к регистру)');
      }

      if (!fitsMaximumSize(tag, MAX_TAG_LENGTH)) {
        errors.push('Не должен быть длиннее ' + MAX_TAG_LENGTH + ' символов');
      }
    });

    var errorsSet = window.utils.arrayToSet(errors);

    return errors.length > 0
      ? {
        result: 'Err',
        errors: errorsSet
      }
      : {
        result: 'Ok'
      };
  };

  window.hashtags = {
    validate: validateHashtag,
  };
})();
