'use strict';

// -------- CONSTANTS --------

var ESC_KEYCODE = 27;
var CSS_HIDDEN_CLASS = 'hidden';

var PICTURES_COUNT = 25;
var LIKES_RANGE = [15, 200];
var MAX_COMMENTS_COUNT = 4;
var MAX_USERS_COUNT = 10;

var MAX_TAGS_COUNT = 5;
var MAX_TAG_LENGTH = 20;
var MAX_BLUR_RADIUS_PX = 3;
var MAX_BRIGHTNESS_VALUE = 3;

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
var loaderElement = document.querySelector('#upload-file');

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

var cssFunction = function (name, value) {
  return name + '(' + value + ')';
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

var initEditorWidget = function () {
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

// -------- FILE LOADER --------

var setLoader = function (onChange) {
  loaderElement.onChange = null;
  loaderElement.addEventListener('change', onChange);
};

var resetLoader = function () {
  loaderElement.value = '';
};

// -------- HANDLERS --------

var onEditorClose = function () {
  return resetLoader();
};

var onLoaderChange = function () {
  return function () {
    editorShow(onEditorClose);
  };
};

// -------- EDITOR --------

var editorWidget = initEditorWidget();

// В объекте потому, что происходит вызов по ключу: ImageEffects[key]()
var ImageEffects = {
  chrome: function (level) {
    return cssFunction('grayscale', level / 100);
  },
  sepia: function (level) {
    return cssFunction('sepia', level / 100);
  },
  marvin: function (level) {
    return cssFunction('invert', level + '%');
  },
  phobos: function (level) {
    return cssFunction('blur', level * MAX_BLUR_RADIUS_PX / 100 + 'px');
  },
  heat: function (level) {
    return cssFunction('brightness', level * MAX_BRIGHTNESS_VALUE / 100);
  },
  none: function () {
    return '';
  }
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

  var errorsSet = arrayToSet(errors);

  return errors.length > 0
    ? {
      result: 'Err',
      errors: errorsSet
    }
    : {
      result: 'Ok'
    };
};

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
  return loweredTags.length === arrayToSet(loweredTags).length;
};

var fitsMaximumSize = function (tag, maxLength) {
  return tag.length <= maxLength;
};

var setEditor = function () {
  var effectLevelLineElement = editorWidget.element.querySelector('.effect-level__line');
  effectLevelLineElement.addEventListener('mouseup', editorEffectLevelLineClickHandler);

  editorWidget.effectRadioElements.forEach(function (elem) {
    elem.addEventListener('click', editorEffectsRadioClickHandler);
  });

  editorWidget.hashtagInputElement.addEventListener('input', editorHashtagInputHandler);
};

var editorCloseButtonClickHandler = function () {
  editorHide(onEditorClose);
};

var editorKeyDownEventHandler = function (ev) {
  if (ev.keyCode === ESC_KEYCODE && ev.target !== editorWidget.hashtagInputElement) {
    editorHide(onEditorClose);
  }
};

var editorEffectLevelLineClickHandler = function (ev) {
  var lineWidth = ev.currentTarget.offsetWidth;
  var mouseX = ev.offsetX;
  editorSetEffectLevel(lineWidth !== 0 ? mouseX * 100 / lineWidth : 0);
};

var editorEffectsRadioClickHandler = function (ev) {
  editorWidget.effectRadioElements.forEach(function (elem) {
    if (elem === ev.target) {
      elem.checked = true;
      editorSetEffectLevel();
    }
  });
};
var editorHashtagInputHandler = function (ev) {
  var hashtagsElement = editorWidget.form.querySelector('.text__hashtags');
  var validation = validateHashtag(hashtagsElement.value);

  if (validation.result === 'Ok') {
    editorWidget.hashtagInputElement.setCustomValidity('');
    return;
  }

  ev.preventDefault();
  var validity = validation.errors.reduce(function (prev, cur) {
    return prev.concat('; ', cur);
  });
  editorWidget.hashtagInputElement.setCustomValidity(validity);
};

var editorGetSelectedEffect = function () {
  var checkedEffect = Array.from(editorWidget.effectRadioElements).find(function (elem) {
    return elem.checked;
  });
  return checkedEffect.value;
};

var editorSetEffectLevel = function (level) {
  var appliedLevel = Math.round(level) || editorWidget.effectLevelValueElement.value;
  var cssFilter = ImageEffects[editorGetSelectedEffect()](appliedLevel);

  editorWidget.effectLevelValueElement.value = appliedLevel;
  editorWidget.effectLevelPinElement.style.left = appliedLevel.toString() + '%';
  editorWidget.effectLevelDepthElement.style.width = appliedLevel.toString() + '%';
  editorWidget.imageUploadPreviewElement.querySelector('img').style.filter = cssFilter;
};

var editorShow = function () {
  editorWidget.element.classList.remove(CSS_HIDDEN_CLASS);

  var closeButton = editorWidget.element.querySelector('#upload-cancel');
  closeButton.addEventListener('click', editorCloseButtonClickHandler);

  document.addEventListener('keydown', editorKeyDownEventHandler);
};

var editorHide = function () {
  editorWidget.element.removeEventListener('click', editorCloseButtonClickHandler);
  document.removeEventListener('keydown', editorKeyDownEventHandler);
  editorWidget.element.classList.add(CSS_HIDDEN_CLASS);
  onEditorClose();
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

// -------- INITIALIZATION --------

var init = function () {
  var pictures = generateItems(PICTURES_COUNT, generatePicture);
  var newPictureNodes = pictures.map(initNewPictureElement);
  showPictures(newPictureNodes);

  setEditor();

  setLoader(onLoaderChange(editorWidget));
};

init();
