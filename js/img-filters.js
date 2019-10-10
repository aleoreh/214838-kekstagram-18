'use strict';
(function () {
  var rootElement = document.querySelector('.img-filters');
  var allFilterButtonsElement = document.querySelectorAll('.img-filters__button');
  var popularFilterButtonElement = rootElement.querySelector('#filter-popular');
  var randomFilterButtonElement = rootElement.querySelector('#filter-random');
  var discussedFilterButtonElement = rootElement.querySelector('#filter-discussed');

  var resetFilterButtons = function () {
    allFilterButtonsElement.forEach(function (button) {
      button.classList.remove('img-filters__button--active');
    });
  };

  var applyFilter = function (filterButton, filter) {
    resetFilterButtons();
    filterButton.classList.add('img-filters__button--active');
    window.pictures.hide();
    window.pictures.show(window.pictures.applyFilter(filter));
  };

  var popularClickHandler = window.debounce(function () {
    applyFilter(popularFilterButtonElement, window.pictures.Filter.getPicturesWithoutFilter);
  });

  var randomClickHandler = window.debounce(function () {
    applyFilter(randomFilterButtonElement, window.pictures.Filter.getRandomOrderedPictures);
  });

  var discussedClickHandler = window.debounce(function () {
    applyFilter(discussedFilterButtonElement, window.pictures.Filter.getMostDiscussedPictures);
  });

  popularFilterButtonElement.addEventListener('click', popularClickHandler);
  randomFilterButtonElement.addEventListener('click', randomClickHandler);
  discussedFilterButtonElement.addEventListener('click', discussedClickHandler);

  var show = function () {
    rootElement.classList.remove('img-filters--inactive');
  };

  var hide = function () {
    rootElement.classList.add('img-filters--inactive');
  };

  window.imgFilters = {
    show: show,
    hide: hide
  };
})();
