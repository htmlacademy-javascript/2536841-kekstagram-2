import {posts} from './createPostsArray.js';

const POSTS_COUNT = 25;

const template = document.querySelector('#picture').content.querySelector('.picture');
const list = document.querySelector('.pictures');
const fragment = document.createDocumentFragment();

posts(POSTS_COUNT).forEach(({url, description, likes, comments}) => {
  const post = template.cloneNode(true);

  const image = post.querySelector('.picture__img');
  image.src = url;
  image.alt = description;

  post.querySelector('.picture__likes').textContent = likes;
  post.querySelector('.picture__comments').textContent = comments.length;

  fragment.append(post);
});

list.append(fragment);
