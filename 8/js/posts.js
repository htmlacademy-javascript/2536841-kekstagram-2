import {onPostOpen} from './viewPost.js';

const template = document.querySelector('#picture').content.querySelector('.picture');
const list = document.querySelector('.pictures');
const fragment = document.createDocumentFragment();

const createNewPost = (post) => {
  const {url, description, likes, comments} = post;
  const newPost = template.cloneNode(true);

  const image = newPost.querySelector('.picture__img');
  image.src = url;
  image.alt = description;

  newPost.querySelector('.picture__likes').textContent = likes;
  newPost.querySelector('.picture__comments').textContent = comments.length;

  newPost.addEventListener('click', (evt) => {
    evt.preventDefault();
    onPostOpen(post);
  });

  return newPost;
};

const renderPosts = (postsArray = []) => {
  postsArray.forEach((postsArrayItem) => {
    fragment.append(createNewPost(postsArrayItem));
  });
  list.append(fragment);
};

export {renderPosts};
