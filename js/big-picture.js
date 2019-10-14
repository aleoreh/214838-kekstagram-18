'use strict';

(function () {
  var bigPictureElement = document.querySelector('.big-picture');
  var bigPictureImgElement = bigPictureElement.querySelector('.big-picture__img img');
  var likesCountElement = bigPictureElement.querySelector('.likes-count');
  var commentsCountElement = bigPictureElement.querySelector('.comments-count');
  var socialCommentsElement = bigPictureElement.querySelector('.social__comments');
  var socialCaptionElement = bigPictureElement.querySelector('.social__caption');

  var addComment = function (comment) {
    var commentTemplate = document.createElement('template');
    commentTemplate.innerHtml =
      // eslint-disable-next-line no-multi-str
      '<li class="social__comment">\
      <img\
        class="social__picture"\
        src=""\
        alt=""\
        width="35" height="35">\
      <p class="social__text"></p>\
      </li>';

    socialCommentsElement.appendChild(commentTemplate.content);
    var commentImg = socialCommentsElement.querySelector('img');
    var socialText = socialCommentsElement.querySelector('.social__text');

    commentImg.src = comment.avatar;
    commentImg.alt = comment.name;
    socialText.textContent = comment.message;

    return commentTemplate;
  };

  var show = function (picture) {
    bigPictureImgElement.src = picture.url;
    likesCountElement.textContent = picture.likes;
    commentsCountElement.textContent = picture.comments.length;
    bigPictureElement.classList.remove('hidden');

    picture.comments.forEach(function (comment) {
      var newComment = addComment(comment);
      socialCommentsElement.appendChild(newComment);
    });

    socialCaptionElement.textContent = picture.description;
  };

  var hide = function () {
    bigPictureElement.classList.add('hidden');
  };

  window.bigPicture = {
    show: show,
    hide: hide
  };
})();
