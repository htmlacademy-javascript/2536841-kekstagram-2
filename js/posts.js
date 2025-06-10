import {postOpen} from './viewPost.js';
import {getUniqueNumber} from './utils.js';

const RANDOM_POSTS_COUNT = 10;

const template = document.querySelector('#picture').content.querySelector('.picture');
const list = document.querySelector('.pictures');
const fragment = document.createDocumentFragment();
const Filters = {
  DEFAULT: 'filter-default',
  RANDOM: 'filter-random',
  DISCUSSED: 'filter-discussed',
};

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
    postOpen(data);
  });

  return post;
};

const renderPosts = (posts = [], filter = Filters.DEFAULT) => {
  if (filter === Filters.DISCUSSED) {
    posts.slice().sort((prevPost, nextPost) => nextPost.comments.length - prevPost.comments.length).forEach((post) => fragment.append(createPost(post)));
  } else if (filter === Filters.RANDOM){
    const getIndex = getUniqueNumber(0, posts.length - 1);
    let postCount = 0;
    while (postCount < RANDOM_POSTS_COUNT) {
      fragment.append(createPost(posts[getIndex()]));
      postCount += 1;
    }
  } else {
    posts.forEach((post) => fragment.append(createPost(post)));
  }
  list.append(fragment);
};

const clearPosts = () => list.querySelectorAll('.picture').forEach((picture) => picture.remove());

export {renderPosts, clearPosts};
