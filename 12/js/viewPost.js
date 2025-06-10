import {isEscapeKey} from './utils.js';

const COMMENTS_LOADER_STEP = 5;

const body = document.querySelector('body');
const modal = body.querySelector('.big-picture');
const modalClose = modal.querySelector('.big-picture__cancel');
const img = modal.querySelector('.big-picture__img img');

const commentsFragment = document.createDocumentFragment();
const commentsList = modal.querySelector('.social__comments');
const commentsLoader = modal.querySelector('.social__comments-loader');
const commentsTemplate = commentsList.querySelector('.social__comment');
const commentsShownCount = modal.querySelector('.social__comment-shown-count');

const onDocumentKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeModal();
  }
};

const loadNextComments = () => {
  let step;

  if (commentsFragment.children.length <= COMMENTS_LOADER_STEP) {
    step = commentsFragment.children.length;
    commentsLoader.classList.add('hidden');
  } else {
    step = COMMENTS_LOADER_STEP;
    commentsLoader.classList.remove('hidden');
  }

  while (step > 0) {
    commentsList.append(commentsFragment.children[0]);
    step -= 1;
  }

  commentsShownCount.textContent = commentsList.children.length;
};

function openModal() {
  body.classList.add('modal-open');
  modal.classList.remove('hidden');

  modalClose.addEventListener('click', closeModal);
  document.addEventListener('keydown', onDocumentKeydown);
}

function closeModal() {
  body.classList.remove('modal-open');
  modal.classList.add('hidden');

  commentsFragment.replaceChildren();
  commentsLoader.removeEventListener('click', loadNextComments);

  modalClose.removeEventListener('click', closeModal);
  document.removeEventListener('keydown', onDocumentKeydown);
}

const createComment = ({avatar, message, name}) => {
  const comment = commentsTemplate.cloneNode(true);

  const commentImg = comment.querySelector('.social__picture');
  commentImg.src = avatar;
  commentImg.alt = name;

  comment.querySelector('.social__text').textContent = message;

  return comment;
};

const showPost = ({url, description, likes, comments}) => {
  img.src = url;
  img.alt = description;

  modal.querySelector('.likes-count').textContent = likes;
  modal.querySelector('.social__caption').textContent = description;
  modal.querySelector('.social__comment-total-count').textContent = comments.length;

  commentsList.innerHTML = '';
  comments.forEach((comment) => commentsFragment.append(createComment(comment)));

  loadNextComments();
  commentsLoader.addEventListener('click', loadNextComments);
};

const postOpen = (post) => {
  showPost(post);
  openModal();
};

export {postOpen};
