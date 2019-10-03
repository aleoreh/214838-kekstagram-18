'use strict';

(function () {
  var PICTURES_COUNT = 25;

  var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
  var picturesElement = document.querySelector('.pictures');

  var showPictures = function (pictureNodes) {
    var fragment = document.createDocumentFragment();

    pictureNodes.forEach(function (element) {
      fragment.appendChild(element);
    });

    picturesElement.appendChild(fragment);
  };

  var initNewPictureElement = function (picture) {
    var element = pictureTemplate.cloneNode(true);

    element.querySelector('.picture__img').setAttribute('src', picture.url);
    element.querySelector('.picture__likes').textContent = picture.likes;
    element.querySelector('.picture__comments').textContent = picture.comments.length;

    return element;
  };

  var show = function () {
    var pictures = window.data.generateItems(PICTURES_COUNT, window.data.generatePicture);
    var newPictureNodes = pictures.map(initNewPictureElement);
    showPictures(newPictureNodes);
  };

  window.pictures = {
    show: show,
  };
})();
