const RERENDER_DELAY = 500;
const ALERT_SHOW_TIME = 5000;

const body = document.querySelector('body');
const dataErrorTemplate = document.querySelector('#data-error').content.querySelector('.data-error');

const isEscapeKey = (evt) => evt.key === 'Escape';

const stopEventPropagation = (evt) => evt.stopPropagation();

const showDataError = () => {
  const error = dataErrorTemplate.cloneNode(true);
  body.append(error);

  setTimeout(() => error.remove(), ALERT_SHOW_TIME);
};

const showMessage = (type, element) => {
  body.append(element);

  document.addEventListener('keydown', (evt) => {
    if (isEscapeKey(evt)) {
      element.remove();
    }
  });
  document.addEventListener('click', (evt) => {
    if(!evt.target.closest(`.${type}__inner`)) {
      element.remove();
    }
  });
  element.querySelector(`.${type}__button`)?.addEventListener('click', () => element.remove());
};

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
  }
  return array;
};

const debounce = (cb, timeoutDelay = RERENDER_DELAY) => {
  let timeoutId;

  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => cb.apply(this, rest), timeoutDelay);
  };
};

export {isEscapeKey, stopEventPropagation, showDataError, showMessage, shuffleArray, debounce};
