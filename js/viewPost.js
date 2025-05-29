import {isEscapeKey} from './utils.js';

const body = document.querySelector('body');

const postModal = document.querySelector('.big-picture');
const postModalClose = postModal.querySelector('.big-picture__cancel');

const postCommentFragment = document.createDocumentFragment();
const postCommentTemplate = document.querySelector('.social__comment');

const commentsCount = postModal.querySelector('.social__comment-count');
const commentsLoader = postModal.querySelector('.comments-loader');

const onDocumentKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closePostModal();
  }
};

function openPostModal() {
  body.classList.add('modal-open');
  postModal.classList.remove('hidden');

  postModalClose.addEventListener('click', closePostModal);
  document.addEventListener('keydown', onDocumentKeydown);

  commentsCount.classList.add('hidden');
  commentsLoader.classList.add('hidden');
}

function closePostModal() {
  body.classList.remove('modal-open');
  postModal.classList.add('hidden');

  postModalClose.removeEventListener('click', closePostModal);
  document.removeEventListener('keydown', onDocumentKeydown);
}

const createPostComment = ({avatar, message, name}) => {
  const newComment = postCommentTemplate.cloneNode(true);

  const commentImage = newComment.querySelector('.social__picture');
  commentImage.src = avatar;
  commentImage.alt = name;

  const commentMessage = newComment.querySelector('.social__text');
  commentMessage.textContent = '';
  message.forEach((item) => {
    commentMessage.textContent += `${item } `;
  });

  return newComment;
};

const showPostData = ({url, description, likes, comments}) => {
  const postImage = postModal.querySelector('.big-picture__img img');
  postImage.src = url;
  postImage.alt = description;

  postModal.querySelector('.likes-count').textContent = likes;

  const postCommentsList = postModal.querySelector('.social__comments');
  postCommentsList.innerHTML = '';
  comments.forEach((comment) => {
    postCommentFragment.append(createPostComment(comment));
  });
  postCommentsList.append(postCommentFragment);

  postModal.querySelector('.social__comment-shown-count').textContent = postCommentsList.children.length;
  postModal.querySelector('.social__comment-total-count').textContent = comments.length;
  postModal.querySelector('.social__caption').textContent = description;
};

const onPostOpen = (post) => {
  showPostData(post);
  openPostModal();
};

export {onPostOpen};
