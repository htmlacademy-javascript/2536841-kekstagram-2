import {openPost} from './view-post.js';

const template = document.querySelector('#picture').content.querySelector('.picture');
const list = document.querySelector('.pictures');
const fragment = document.createDocumentFragment();

const createPost = (data = {}) => {
  const {url, description, likes, comments} = data;
  const post = template.cloneNode(true);

  const img = post.querySelector('.picture__img');
  img.src = url;
  img.alt = description;

  post.querySelector('.picture__likes').textContent = likes;
  post.querySelector('.picture__comments').textContent = comments.length;

  post.addEventListener('click', (evt) => {
    evt.preventDefault();
    openPost(data);
  });

  return post;
};

const renderPosts = (posts = []) => {
  posts.forEach((post) => fragment.append(createPost(post)));
  list.append(fragment);
};

const clearPosts = () => list.querySelectorAll('.picture').forEach((picture) => picture.remove());

export {renderPosts, clearPosts};
