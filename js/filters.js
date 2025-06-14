import {debounce, shuffleArray} from './utils.js';
import {renderPosts, clearPosts} from './posts.js';

const showFilters = (posts = []) => {
  const RANDOM_POSTS_COUNT = 10;

  const filters = document.querySelector('.img-filters');
  const filtersForm = document.querySelector('.img-filters__form');
  const filtersButtons = document.querySelectorAll('.img-filters__button');

  const availableFilters = {
    'filter-default': posts.slice(),
    'filter-random': shuffleArray(posts.slice(0, RANDOM_POSTS_COUNT)),
    'filter-discussed': posts.slice().sort((prevPost, nextPost) => nextPost.comments.length - prevPost.comments.length),
  };

  const switchActiveFilter = (target) => filtersButtons.forEach((button) => button === target ? button.classList.add('img-filters__button--active') : button.classList.remove('img-filters__button--active'));

  const setPostsFilter = debounce((evt) => {
    clearPosts();
    renderPosts(availableFilters[evt.target.id]);
  });

  const onFilterClick = (evt) => {
    if (!evt.target.classList.contains('img-filters__button--active')) {
      switchActiveFilter(evt.target);
      setPostsFilter(evt);
    }
  };

  filters.classList.remove('img-filters--inactive');
  filtersForm.addEventListener('click', onFilterClick);
};

export {showFilters};
