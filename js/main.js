// -------- CONSTANTS --------

var PICTURES_COUNT = 25;
var LIKES_RANGE = [15, 200];
var COMMENTS_BOUND = 4; // maximum count of comments
var USERS_BOUND = 10; // maximum count of users

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
}

// -------- CONSTRUCTORS --------

var initComment = function (avatar, message, name) {
  return {
    avatar, message, name
  }
}

var initPicture = function (url, description, likes, comments) {
  return {
    url, description, likes, comments
  };
}

// -------- GENERATORS --------

var generateItems = function (itemsCount, generator) {
  var res = range(itemsCount).map(generator);
  return res;
};

// ---- comments ----

var generateComment = function (index) {
  var avatar = 'img/avatar-' + randomInt(USERS_BOUND) + '.svg';
  var message = MESSAGES[randomInt(MESSAGES.length)];
  var name = USER_NAMES[randomInt(USER_NAMES.length)];

  return initComment(avatar, message, name);
};

var generateComments = function () {
  var commentsCount = randomInt(COMMENTS_BOUND) + 1;
  return generateItems(commentsCount, generateComment);
};

// ---- photos ----

var generatePicture = function (index) {
  var url = 'photos/' + (index + 1) + '.jpg';
  var description = '';
  var likes = randomInt(LIKES_RANGE[1] - LIKES_RANGE[0]) + LIKES_RANGE[0];
  comments = generateComments();

  return initPicture(url, description, likes, comments);
};

var generatePictures = function () {
  return generateItems(PICTURES_COUNT, generatePicture);
};

// -------- DOM --------

var initPictureElement = function (picture) {
  var element = pictureTemplate.cloneNode(true);

  element.querySelector('.picture__img').setAttribute('src', picture.url);
  element.querySelector('.picture__likes').textContent = picture.likes;
  element.querySelector('.picture__comments').textContent = picture.comments.length;

  return element;
}

var showPictures = function (pictureNodes) {
  pictureNodes.forEach(function (element) {
    picturesElement.appendChild(element);
  });
};

// -------- INITIALIZATION --------

var init = function () {
  var pictures = generatePictures();
  var pictureNodes = pictures.map(initPictureElement);
  showPictures(pictureNodes);
}

init();
