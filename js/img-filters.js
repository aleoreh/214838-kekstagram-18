'use strict';
(function () {
  var rootElement = document.querySelector('.img-filters');
  var allFilterButtons = document.querySelectorAll('.img-filters__button');
  var popularFilterButton = rootElement.querySelector('#filter-popular');
  var randomFilterButton = rootElement.querySelector('#filter-random');
  var discussedFilterButton = rootElement.querySelector('#filter-discussed');

  var resetFilterButtons = function () {
    allFilterButtons.forEach(function (button) {
      button.classList.remove('img-filters__button--active');
    });
  };

  var applyFilter = function (filterButton, filter) {
    resetFilterButtons();
    filterButton.classList.add('img-filters__button--active');
    window.pictures.hide();
    window.pictures.show(window.pictures.applyFilter(filter));
  };

  var popularClickHandler = function () {
    applyFilter(popularFilterButton, window.pictures.Filter.None);
  };

  var randomClickHandler = function () {
    applyFilter(randomFilterButton, window.pictures.Filter.Random);
  };

  var discussedClickHandler = function () {
    applyFilter(discussedFilterButton, window.pictures.Filter.Discussed);
  };

  popularFilterButton.addEventListener('click', popularClickHandler);
  randomFilterButton.addEventListener('click', randomClickHandler);
  discussedFilterButton.addEventListener('click', discussedClickHandler);

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
