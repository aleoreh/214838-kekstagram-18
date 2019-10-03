'use strict';

(function () {
  var LIKES_RANGE = [15, 200];
  var MAX_COMMENTS_COUNT = 4;
  var MAX_USERS_COUNT = 10;

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

  var generateItems = function (itemsCount, generator) {
    return window.utils.range(itemsCount).map(generator);
  };

  // ---- comments ----

  var generateComment = function () {
    var avatar = 'img/avatar-' + window.utils.randomInt(MAX_USERS_COUNT) + '.svg';
    var message = MESSAGES[window.utils.randomInt(MESSAGES.length)];
    var name = USER_NAMES[window.utils.randomInt(USER_NAMES.length)];

    return initComment(avatar, message, name);
  };

  var generateComments = function () {
    var commentsCount = window.utils.randomInt(MAX_COMMENTS_COUNT) + 1;
    return generateItems(commentsCount, generateComment);
  };

  var generatePicture = function (index) {
    var url = 'photos/' + (index + 1) + '.jpg';
    var description = '';
    var likes = window.utils.randomInt(LIKES_RANGE[1] - LIKES_RANGE[0]) + LIKES_RANGE[0];
    var comments = generateComments();

    return initPicture(url, description, likes, comments);
  };

  window.data = {
    generatePicture: generatePicture,
    generateItems: generateItems
  };
})();
