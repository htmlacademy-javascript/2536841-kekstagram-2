import {isEscapeKey} from './utils.js';

const body = document.querySelector('body');

const postModal = body.querySelector('.big-picture');
const postModalClose = postModal.querySelector('.big-picture__cancel');
const postImage = postModal.querySelector('.big-picture__img img');

const postCommentFragment = document.createDocumentFragment();
const postCommentTemplate = postModal.querySelector('.social__comment');
const postCommentsList = postModal.querySelector('.social__comments');
const postCommentsLoader = postModal.querySelector('.social__comments-loader');
const postCommentsShownCount = postModal.querySelector('.social__comment-shown-count');

const onDocumentKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closePostModal();
  }
};

const showNextComments = () => {
  let loadStep;

  if (postCommentFragment.children.length <= 5) {
    loadStep = postCommentFragment.children.length;
    postCommentsLoader.classList.add('hidden');
  } else {
    loadStep = 5;
    postCommentsLoader.classList.remove('hidden');
  }

  while (loadStep > 0) {
    postCommentsList.append(postCommentFragment.children[0]);
    loadStep -= 1;
  }

  postCommentsShownCount.textContent = postCommentsList.children.length;
};

function openPostModal() {
  body.classList.add('modal-open');
  postModal.classList.remove('hidden');

  postModalClose.addEventListener('click', closePostModal);
  document.addEventListener('keydown', onDocumentKeydown);
}

function closePostModal() {
  body.classList.remove('modal-open');
  postModal.classList.add('hidden');

  postCommentFragment.replaceChildren();
  postCommentsLoader.removeEventListener('click', showNextComments);

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
  postImage.src = url;
  postImage.alt = description;

  postModal.querySelector('.likes-count').textContent = likes;
  postModal.querySelector('.social__caption').textContent = description;
  postModal.querySelector('.social__comment-total-count').textContent = comments.length;

  postCommentsList.innerHTML = '';
  comments.forEach((comment) => {
    postCommentFragment.append(createPostComment(comment));
  });

  showNextComments();
  postCommentsLoader.addEventListener('click', showNextComments);
};

const onPostOpen = (post) => {
  showPostData(post);
  openPostModal();
};

export {onPostOpen};
