const RERENDER_DELAY = 500;
const ALERT_SHOW_TIME = 5000;

const body = document.querySelector('body');
const dataErrorTemplate = body.querySelector('#data-error').content.querySelector('.data-error');

const isEscapeKey = (evt) => evt.key === 'Escape';

const onInputKeydown = (evt) => evt.stopPropagation();

const showDataError = (errorText) => {
  const error = dataErrorTemplate.cloneNode(true);
  if (errorText) {
    error.querySelector('.data-error__title').textContent = errorText;
  }
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

const debounce = (cb, timeoutDelay = RERENDER_DELAY) => {
  let timeoutId;

  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => cb.apply(this, rest), timeoutDelay);
  };
};

export {isEscapeKey, onInputKeydown, showDataError, showMessage, debounce};
