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
var bigPictureElement = document.querySelector('.big-picture');

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

var showBigPictureElement = function (picture) {
  var bigPictureImgElement = bigPictureElement.querySelector('.big-picture__img');
  var likesCountElement = bigPictureElement.querySelector('.likes-count');
  var socialCommentsElement = bigPictureElement.querySelector('.social__comments');
  var socialCommentElement = socialCommentsElement.querySelector('.social__comment');

  bigPictureImgElement.querySelector('img').setAttribute('src', picture.url);
  likesCountElement.textContent = picture.likes;

  var socialCommentsFragment = document.createDocumentFragment();

  range(picture.comments.length - 1).forEach(function (i) {
    socialCommentsFragment.appendChild(renderSocialCommentElement(picture.comments[i], socialCommentElement));
  });

  socialCommentsElement.parentNode.replaceChild(socialCommentsFragment, socialCommentsElement);


  bigPictureElement.classList.remove('hidden');
};

// -------- INITIALIZATION --------

var init = function () {
  var pictures = generateItems(PICTURES_COUNT, generatePicture);
  var newPictureNodes = pictures.map(initNewPictureElement);
  showPictures(newPictureNodes);
  showBigPictureElement(pictures[9]);
};

init();
