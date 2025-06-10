const buttons = document.querySelectorAll('.img-filters__button');

const switchActiveFilter = (target) => buttons.forEach((button) => button === target ? button.classList.add('img-filters__button--active') : button.classList.remove('img-filters__button--active'));

const setPostsFilter = (cb) => {
  document.querySelector('.img-filters').classList.remove('img-filters--inactive');

  buttons.forEach((button) => button.addEventListener('click', (evt) => {
    if (!evt.target.classList.contains('img-filters__button--active')) {
      switchActiveFilter(evt.target);
      cb(evt.target.id);
    }
  }));
};

export {setPostsFilter};
