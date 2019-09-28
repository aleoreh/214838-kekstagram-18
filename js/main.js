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

var uploadFileElement = document.querySelector('#upload-file');

var pictureEditorElement = document.querySelector('.big-picture');
var pictureEditorCloseElement = pictureEditorElement.querySelector('#picture-cancel');
var pictureEditorImgElement = pictureEditorElement.querySelector('.big-picture__img');
var pictureEditorLikesCountElement = pictureEditorElement.querySelector('.likes-count');

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
    return Editor.show(editor, function () {
      return Loader.reset(loader);
    });
  };
};

// -------- CONTROLS --------

var Editor = {
  closeButtonClickHandler: function (editor, onClose) {
    return function () {
      Editor.hide(editor, onClose);
    };
  },
  keyDownEventHandler: function (editor, onClose) {
    return function (ev) {
      if (ev.key === 'Escape') {
        Editor.hide(editor, onClose);
      }
    };
  },
  init: function () {
    return ({
      element: document.querySelector('.big-picture'),
    });
  },
  set: function (editor, picture) {
    var likesCountElement = editor.element.querySelector('.likes-count');
    var socialCommentsElement = editor.element.querySelector('.social__comments');
    var socialCommentElement = socialCommentsElement.querySelector('.social__comment');
    var socialCommentsFragment = document.createDocumentFragment();

    editor.element.querySelector('img').setAttribute('src', picture.url);
    likesCountElement.textContent = picture.likes;

    range(picture.comments.length - 1).forEach(function (i) {
      var newSocialCommentElement = socialCommentElement.cloneNode(true);
      socialCommentsFragment.appendChild(renderSocialCommentElement(picture.comments[i], newSocialCommentElement));
    });

    socialCommentsElement.parentNode.replaceChild(socialCommentsFragment, socialCommentsElement);
  },
  show: function (editor, onClose) {
    editor.element.classList.remove('hidden');

    var closeButton = editor.element.querySelector('#picture-cancel');
    closeButton.addEventListener('click', Editor.closeButtonClickHandler(editor, onClose));

    document.addEventListener('keydown', Editor.keyDownEventHandler(editor, onClose));
  },
  hide: function (editor, onClose) {
    editor.element.removeEventListener('click', Editor.closeButtonClickHandler());
    document.removeEventListener('keydown', Editor.keyDownEventHandler());
    editor.element.classList.add('hidden');
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
  var editor = Editor.init();
  Editor.set(editor, pictures[randomInt(pictures.length - 1)]);

  Loader.set(loader, onLoaderChange(loader, editor));
};

init();
