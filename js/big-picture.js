'use strict';

(function () {
  var MAX_COMMENT_LENGTH = 140;

  var bigPictureElement = document.querySelector('.big-picture');
  var bigPictureImgElement = bigPictureElement.querySelector('.big-picture__img img');
  var likesCountElement = bigPictureElement.querySelector('.likes-count');
  var commentsCountElement = bigPictureElement.querySelector('.comments-count');
  var socialCommentsElement = bigPictureElement.querySelector('.social__comments');
  var socialCaptionElement = bigPictureElement.querySelector('.social__caption');
  var socialCommentCountElement = bigPictureElement.querySelector('.social__comment-count');
  var commentsLoaderElement = bigPictureElement.querySelector('.comments-loader');
  var socialFooterTextElement = bigPictureElement.querySelector('.social__footer-text');

  var setup = function () {
    socialFooterTextElement.addEventListener('input', inputCommentEventHandler);
  };

  var inputCommentEventHandler = function (ev) {
    var validation = validateComment(ev.target.value);

    if (validation.result === 'Ok') {
      socialFooterTextElement.setCustomValidity('');
      return;
    }

    ev.preventDefault();

    var validity = validation.errors.reduce(function (prev, cur) {
      return prev.concat('; ', cur);
    });
    socialFooterTextElement.setCustomValidity(validity);
    // socialFooterTextElement.
  };

  var validateComment = function (value) {
    var errors = [];

    if (value.length > MAX_COMMENT_LENGTH) {
      errors.push('Длина комментария не может превышать ' + MAX_COMMENT_LENGTH + ' символов');
    }

    if (errors.length > 0) {
      return {
        result: 'Err',
        errors: errors
      };
    }

    return {
      result: 'Ok'
    };
  };

  var addComment = function (comment) {
    var commentFragment = document.createDocumentFragment();

    var li = commentFragment.appendChild(document.createElement('li'));
    var img = li.appendChild(document.createElement('img'));
    var p = li.appendChild(document.createElement('p'));

    li.classList.add('social__comment');

    img.classList.add('social__picture');
    img.src = comment.avatar;
    img.alt = comment.name;

    p.classList.add('social__text');
    p.textContent = comment.message;

    socialCommentsElement.appendChild(commentFragment);

    return commentFragment;
  };

  var hide = function () {
    bigPictureElement.classList.add('hidden');
  };

  var closeButtonClickHandler = function () {
    hide();
  };

  var keyDownEventHandler = function (ev) {
    if (ev.keyCode === window.common.ESC_KEYCODE && ev.target !== socialFooterTextElement) {
      hide();
    }
  };

  var show = function (picture) {
    bigPictureImgElement.src = picture.url;
    likesCountElement.textContent = picture.likes;
    commentsCountElement.textContent = picture.comments.length;
    bigPictureElement.classList.remove('hidden');
    socialCommentsElement.childNodes.forEach(function (node) {
      socialCommentsElement.removeChild(node);
    });

    picture.comments.forEach(function (comment) {
      var newComment = addComment(comment);
      socialCommentsElement.appendChild(newComment);
    });

    socialCaptionElement.textContent = picture.description;

    socialCommentCountElement.classList.add('visually-hidden');
    commentsLoaderElement.classList.add('visually-hidden');

    var closeButton = bigPictureElement.querySelector('#picture-cancel');
    closeButton.addEventListener('click', closeButtonClickHandler);

    document.addEventListener('keydown', keyDownEventHandler);
  };

  setup();

  window.bigPicture = {
    show: show,
    hide: hide
  };
})();
