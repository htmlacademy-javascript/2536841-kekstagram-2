import {debounce} from './utils.js';
import {renderPosts, clearPosts} from './posts.js';

const RANDOM_POSTS_COUNT = 10;
const ACTIVE_BUTTON_CLASS = 'img-filters__button--active';

const showFilters = (posts = []) => {
  const filters = document.querySelector('.img-filters');
  filters.classList.remove('img-filters--inactive');

  const filtersForm = filters.querySelector('.img-filters__form');

  const availableFilters = {
    'filter-default': posts.slice(),
    'filter-random': posts.toSorted(() => 0.5 - Math.random()).slice(0, RANDOM_POSTS_COUNT),
    'filter-discussed': posts.slice().sort((prevPost, nextPost) => nextPost.comments.length - prevPost.comments.length),
  };

  const switchActiveFilter = (target) => {
    filtersForm.querySelector(`.${ACTIVE_BUTTON_CLASS}`).classList.remove(ACTIVE_BUTTON_CLASS);
    target.classList.add(ACTIVE_BUTTON_CLASS);
  };

  const setPostsFilter = debounce((evt) => {
    clearPosts();
    renderPosts(availableFilters[evt.target.id]);
  });

  const onFilterClick = (evt) => {
    if (!evt.target.classList.contains(ACTIVE_BUTTON_CLASS)) {
      switchActiveFilter(evt.target);
      setPostsFilter(evt);
    }
  };

  filtersForm.addEventListener('click', onFilterClick);
};

export {showFilters};
