'use strict';

// -------- CONSTANTS --------

var PICTURES_COUNT = 25;
var LIKES_RANGE = [15, 200];
var MAX_COMMENTS_COUNT = 4;
var MAX_USERS_COUNT = 10;
var MAX_SOCIAL_PICTURE_AVATARS_COUNT = 5;

var MESSAGES = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!',
];

var USER_NAMES = [
  'Баташев Наталий',
  'Похвиснев Витольд',
  'Хрущов Рафаил',
  'Головачёв Фалалей',
  'Михальский Мартын',
  'Болтин Кристиан',
  'Бетев Урван',
  'Чуфаровский Серафим',
  'Боршеватинов Гвидон',
  'Бестужев Захар',
  'Вельяшев Харлампий',
  'Ипатович Исидор',
  'Кутузов Панфил',
  'Могилевский Евфрасий',
  'Пазухин Гиацинт',
];

// -------- DOM ELEMENTS --------

var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
var picturesElement = document.querySelector('.pictures');

// -------- UTILS --------

/**
 * Generates random int number from 0 to (maxBound - 1)
 *
 * @param {number} maxBound maximal int number to generate
 *
 * @return {number} random int number from 0 to maxBound
 */
var randomInt = function (maxBound) {
  return Math.floor(Math.random() * maxBound);
};

/**
 * Generates a sequence of numbers from 0 to n
 *
 * @param {number} n maximal number in generated range
 *
 * @return {Array<number>} [0, 1, ..., n]
 */
var range = function (n) {
  var res = [];
  for (var i = 0; i < n; i++) {
    res.push(i);
  }
  return res;
};

var arrayToSet = function (array) {
  return array.filter(function (v, i) {
    return array.indexOf(v) === i;
  });
};

// -------- HELPERS --------

var Hashtag = {
  MAX_TAGS_COUNT: 5,
  MAX_TAG_LENGTH: 20,
  validate: function (hashtagsString) {
    var errors = [];

    var tags = hashtagsString.split(' ');

    if (tags.length > Hashtag.MAX_TAGS_COUNT) {
      errors.push('Должно быть не более ' + Hashtag.MAX_TAGS_COUNT + ' тэгов');
    }

    tags.forEach(function (tag) {
      if (tag === '') {
        return;
      }

      if (!Hashtag.beginsWithHash(tag)) {
        errors.push('Должен начинаться с #');
      }

      if (!Hashtag.isNotOnlyHash(tag)) {
        errors.push('Не должен состоять только из #');
      }

      if (!Hashtag.separatedOnlyBySpace(tag)) {
        errors.push('Тэги должны разделяться только пробелами');
      }

      if (!Hashtag.noDuplicates(tags)) {
        errors.push('Один и тот же тэг не может быть использован дважды (тэги нечувствительны к регистру)');
      }

      if (!Hashtag.fitsMaximumSize(tag, Hashtag.MAX_TAG_LENGTH)) {
        errors.push('Не должен быть длиннее ' + Hashtag.MAX_TAG_LENGTH + ' символов');
      }
    });

    var errorsSet = arrayToSet(errors);

    return errors.length > 0
      ? {
        result: 'Err',
        errors: errorsSet
      }
      : {
        result: 'Ok'
      };
  },
  beginsWithHash: function (tag) {
    return tag.charAt(0) === '#';
  },
  isNotOnlyHash: function (tag) {
    return tag !== '#';
  },
  separatedOnlyBySpace: function (tag) {
    var match = tag.match(/#/g);
    return match && match.length === 1;
  },
  noDuplicates: function (tags) {
    var loweredTags = tags.map(function (tag) {
      return tag.toLowerCase();
    });
    return loweredTags.length === arrayToSet(loweredTags).length;
  },
  fitsMaximumSize: function (tag, maxLength) {
    return tag.length <= maxLength;
  }
};

// -------- CONSTRUCTORS --------

var initComment = function (avatar, message, name) {
  return {
    avatar: avatar, message: message, name: name
  };
};

var initPicture = function (url, description, likes, comments) {
  return {
    url: url, description: description, likes: likes, comments: comments
  };
};

// -------- GENERATORS --------

var generateItems = function (itemsCount, generator) {
  return range(itemsCount).map(generator);
};

// ---- comments ----

var generateComment = function () {
  var avatar = 'img/avatar-' + randomInt(MAX_USERS_COUNT) + '.svg';
  var message = MESSAGES[randomInt(MESSAGES.length)];
  var name = USER_NAMES[randomInt(USER_NAMES.length)];

  return initComment(avatar, message, name);
};

var generateComments = function () {
  var commentsCount = randomInt(MAX_COMMENTS_COUNT) + 1;
  return generateItems(commentsCount, generateComment);
};

// ---- photos ----

var generatePicture = function (index) {
  var url = 'photos/' + (index + 1) + '.jpg';
  var description = '';
  var likes = randomInt(LIKES_RANGE[1] - LIKES_RANGE[0]) + LIKES_RANGE[0];
  var comments = generateComments();

  return initPicture(url, description, likes, comments);
};

// -------- HANDLERS --------

var onLoaderChange = function (loader, editor) {
  return function () {
    Editor.show(editor, function () {
      return Loader.reset(loader);
    });
  };
};

// -------- CONTROLS --------

var ImageEffect = {
  MAX_BLUR_RADIUS_PX: 3,
  MAX_BRIGHTNESS_VALUE: 3,
  cssFunction: function (name, value) {
    return name + '(' + value + ')';
  },
  chrome: function (level) {
    return ImageEffect.cssFunction('grayscale', level / 100);
  },
  sepia: function (level) {
    return ImageEffect.cssFunction('sepia', level / 100);
  },
  marvin: function (level) {
    return ImageEffect.cssFunction('invert', level + '%');
  },
  phobos: function (level) {
    return ImageEffect.cssFunction('blur', level * ImageEffect.MAX_BLUR_RADIUS_PX / 100 + 'px');
  },
  heat: function (level) {
    return ImageEffect.cssFunction('brightness', level * ImageEffect.MAX_BRIGHTNESS_VALUE / 100);
  },
  none: function () {
    return '';
  }
};

var Editor = {
  DEFAULT_EFFECT_LEVEL: 20,
  init: function () {
    var form = document.querySelector('.img-upload__form');
    var element = form.querySelector('.img-upload__overlay');
    var imageUploadPreviewElement = element.querySelector('.img-upload__preview');

    var effectRadioElements = element.querySelectorAll('input[name="effect"]');
    var effectLevelInputElement = element.querySelector('.effect-level');
    var effectLevelValueElement = element.querySelector('.effect-level__value');
    var effectLevelPinElement = element.querySelector('.effect-level__pin');
    var effectLevelDepthElement = element.querySelector('.effect-level__depth');

    var hashtagInputElement = element.querySelector('.text__hashtags');

    return {
      form: form,
      element: element,
      imageUploadPreviewElement: imageUploadPreviewElement,
      effectRadioElements: effectRadioElements,
      effectLevelInputElement: effectLevelInputElement,
      effectLevelValueElement: effectLevelValueElement,
      effectLevelPinElement: effectLevelPinElement,
      effectLevelDepthElement: effectLevelDepthElement,
      hashtagInputElement: hashtagInputElement,
    };
  },
  set: function (control) {
    var effectLevelLineElement = control.element.querySelector('.effect-level__line');
    effectLevelLineElement.addEventListener('mouseup', Editor.effectLevelLineClickHandler(control));

    control.effectRadioElements.forEach(function (elem) {
      elem.addEventListener('click', Editor.effectsRadioClickHandler(control));
    });

    control.hashtagInputElement.addEventListener('input', Editor.hashtagInputHandler(control));
  },
  closeButtonClickHandler: function (control, onClose) {
    return function () {
      Editor.hide(control, onClose);
    };
  },
  keyDownEventHandler: function (control, onClose) {
    return function (ev) {
      if (ev.key === 'Escape' && ev.target !== control.hashtagInputElement) {
        Editor.hide(control, onClose);
      }
    };
  },
  effectLevelLineClickHandler: function (control) {
    return function (ev) {
      var lineWidth = ev.currentTarget.offsetWidth;
      var mouseX = ev.offsetX;
      Editor.setEffectLevel(control, lineWidth !== 0 ? mouseX * 100 / lineWidth : 0);
    };
  },
  effectsRadioClickHandler: function (control) {
    return function (ev) {
      control.effectRadioElements.forEach(function (elem) {
        if (elem === ev.target) {
          elem.checked = true;
          Editor.setEffectLevel(control);
        }
      });
    };
  },
  hashtagInputHandler: function (control) {
    return function (ev) {
      var validation = Editor.validateHashtag(control);

      if (validation.result === 'Ok') {
        control.hashtagInputElement.setCustomValidity('');
        return;
      }

      ev.preventDefault();
      var validity = validation.errors.reduce(function (prev, cur) {
        return prev.concat('; ', cur);
      });
      control.hashtagInputElement.setCustomValidity(validity);
    };
  },
  getSelectedEffect: function (control) {
    var checkedEffect = Array.from(control.effectRadioElements).find(function (elem) {
      return elem.checked;
    });
    return checkedEffect.value;
  },
  setEffectLevel: function (control, level) {
    var appliedLevel = Math.round(level) || control.effectLevelValueElement.value;
    var cssFilter = ImageEffect[Editor.getSelectedEffect(control)](appliedLevel);

    control.effectLevelValueElement.value = appliedLevel;
    control.effectLevelPinElement.style.left = appliedLevel.toString() + '%';
    control.effectLevelDepthElement.style.width = appliedLevel.toString() + '%';
    control.imageUploadPreviewElement.querySelector('img').style.filter = cssFilter;
  },
  validateHashtag: function (control) {
    var hashtagsElement = control.form.querySelector('.text__hashtags');
    return Hashtag.validate(hashtagsElement.value);
  },
  show: function (control, onClose) {
    control.element.classList.remove('hidden');

    var closeButton = control.element.querySelector('#upload-cancel');
    closeButton.addEventListener('click', Editor.closeButtonClickHandler(control, onClose));

    document.addEventListener('keydown', Editor.keyDownEventHandler(control, onClose));
  },
  hide: function (control, onClose) {
    control.element.removeEventListener('click', Editor.closeButtonClickHandler());
    document.removeEventListener('keydown', Editor.keyDownEventHandler());
    control.element.classList.add('hidden');
    onClose();
  }
};

var FullPicture = {
  init: function () {
    return ({
      element: document.querySelector('.big-picture'),
    });
  },
  set: function (control, picture) {
    var likesCountElement = control.element.querySelector('.likes-count');
    var socialCommentsElement = control.element.querySelector('.social__comments');
    var socialCommentElement = socialCommentsElement.querySelector('.social__comment');

    control.element.querySelector('img').setAttribute('src', picture.url);
    likesCountElement.textContent = picture.likes;

    var newSocialCommentsElement = socialCommentsElement.cloneNode(true);
    range(picture.comments.length - 1).forEach(function (i) {
      var newSocialCommentElement = socialCommentElement.cloneNode(true);
      newSocialCommentsElement.appendChild(renderSocialCommentElement(picture.comments[i], newSocialCommentElement));
    });

    socialCommentsElement.parentNode.replaceChild(newSocialCommentsElement, socialCommentsElement);
  },
  closeButtonClickHandler: function (control, onClose) {
    return function () {
      FullPicture.hide(control, onClose);
    };
  },
  keyDownEventHandler: function (control, onClose) {
    return function (ev) {
      if (ev.key === 'Escape') {
        FullPicture.hide(control, onClose);
      }
    };
  },
  show: function (control, onClose) {
    control.element.classList.remove('hidden');

    var closeButton = control.element.querySelector('#picture-cancel');
    closeButton.addEventListener('click', FullPicture.closeButtonClickHandler(control, onClose));

    document.addEventListener('keydown', FullPicture.keyDownEventHandler(control, onClose));
  },
  hide: function (control, onClose) {
    control.element.removeEventListener('click', FullPicture.closeButtonClickHandler());
    document.removeEventListener('keydown', FullPicture.keyDownEventHandler());
    control.element.classList.add('hidden');
    onClose();
  }
};

var Loader = {
  init: function () {
    return {
      element: document.querySelector('#upload-file')
    };
  },
  set: function (loader, onChange) {
    loader.element.onChange = null;
    loader.element.addEventListener('change', onChange);
  },
  reset: function (loader) {
    loader.element.value = '';
  }
};

// -------- DOM --------

var initNewPictureElement = function (picture) {
  var element = pictureTemplate.cloneNode(true);

  element.querySelector('.picture__img').setAttribute('src', picture.url);
  element.querySelector('.picture__likes').textContent = picture.likes;
  element.querySelector('.picture__comments').textContent = picture.comments.length;

  return element;
};

var showPictures = function (pictureNodes) {
  var fragment = document.createDocumentFragment();

  pictureNodes.forEach(function (element) {
    fragment.appendChild(element);
  });

  picturesElement.appendChild(fragment);
};

var renderSocialCommentElement = function (comment, exampleElement) {
  var res = exampleElement.cloneNode(true);

  var img = res.querySelector('img');
  var p = res.querySelector('p');

  img.setAttribute('src', 'img/avatar-' + (randomInt(MAX_SOCIAL_PICTURE_AVATARS_COUNT) + 1) + '.svg');
  img.setAttribute('alt', comment.name);
  p.textContent = comment.message;

  return res;
};

// -------- INITIALIZATION --------

var init = function () {
  var pictures = generateItems(PICTURES_COUNT, generatePicture);
  var newPictureNodes = pictures.map(initNewPictureElement);
  showPictures(newPictureNodes);

  var loader = Loader.init();

  var fullPicture = FullPicture.init();
  FullPicture.set(fullPicture, pictures[randomInt(pictures.length - 1)]);

  var editor = Editor.init();
  Editor.set(editor);

  Loader.set(loader, onLoaderChange(loader, editor));
};

init();
