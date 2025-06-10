import {getData} from './api.js';
import {renderPosts, clearPosts} from './posts.js';
import {setPostsFilter} from './filters.js';
import {debounce} from './utils.js';
import './viewPost.js';
import './form.js';

const RERENDER_DELAY = 500;

getData().then((posts) => {
  renderPosts(posts);
  setPostsFilter(debounce((filter) => {
    clearPosts();
    renderPosts(posts, filter);
  }, RERENDER_DELAY));
});
