'use strict';

(function () {
  var RANDOM_FILTER_COUNT = 10;

  var items = [];

  var Filter = {
    getPicturesWithoutFilter: function () {
      return window.pictures.items;
    },
    getRandomOrderedPictures: function () {
      var randoms = window.utils.range(window.pictures.items.length - 1).map(function () {
        return window.utils.randomInt(window.pictures.items.length - 1);
      });
      return window.pictures.items
      .slice()
      .map(function (picture, index) {
        return {
          weight: randoms[index],
          value: picture
        };
      })
      .sort(function (prev, next) {
        return next.weight - prev.weight;
      })
      .map(function (extendedPicture) {
        return extendedPicture.value;
      })
      .slice(0, RANDOM_FILTER_COUNT);
    },
    getMostDiscussedPictures: function () {
      return window.pictures.items.slice().sort(function (prev, cur) {
        return cur.comments.length - prev.comments.length;
      });
    }
  };

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

    pictureElement.addEventListener('click', function () {
      window.bigPicture.show(picture);
    });

    return pictureElement;
  };

  var applyFilter = function (filteringFunction) {
    return filteringFunction(window.pictures.items);
  };

  var show = function (pictures) {
    hide();
    var newPictureNodes = pictures.map(initNewPictureElement);
    showPictures(newPictureNodes);
  };

  var hide = function () {
    picturesElement.querySelectorAll('.picture').forEach(function (node) {
      node.remove();
    });
  };

  window.pictures = {
    items: items,
    Filter: Filter,
    applyFilter: applyFilter,
    show: show,
    hide: hide
  };
})();
