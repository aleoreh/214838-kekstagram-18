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
    var pictureElement = pictureTemplate.cloneNode(true);

    pictureElement.querySelector('.picture__img').setAttribute('src', picture.url);
    pictureElement.querySelector('.picture__likes').textContent = picture.likes;
    pictureElement.querySelector('.picture__comments').textContent = picture.comments.length;

    return pictureElement;
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
