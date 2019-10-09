'use strict';

(function () {
  var RANDOM_FILTER_COUNT = 10;

  var Filter = {
    None: function () {
      return window.state.pictures;
    },
    Random: function () {
      var randoms = window.utils.range(window.state.pictures.length - 1).map(function () {
        return window.utils.randomInt(window.state.pictures.length - 1);
      });
      return window.state.pictures
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
    Discussed: function () {
      return window.state.pictures.slice().sort(function (prev, cur) {
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

    return pictureElement;
  };

  var applyFilter = function (filteringFunction) {
    return filteringFunction(window.state.pictures);
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
    Filter: Filter,
    applyFilter: applyFilter,
    show: show,
    hide: hide
  };
})();
