import {getData} from './api.js';
import {renderPosts} from './posts.js';
import {showFilters} from './filters.js';
import './viewPost.js';
import './form.js';

getData().then((posts) => {
  renderPosts(posts);
  showFilters(posts);
});
