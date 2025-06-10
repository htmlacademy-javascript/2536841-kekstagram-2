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

const getRandomNumber = (min = 0, max = 1) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getUniqueNumber = (min, max) => {
  const previousValues = [];

  return () => {
    let currentValue = getRandomNumber(min, max);
    while (previousValues.includes(currentValue)) {
      currentValue = getRandomNumber(min, max);
    }
    previousValues.push(currentValue);
    return currentValue;
  };
};

const debounce = (cb, timeoutDelay = 500) => {
  let timeoutId;

  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => cb.apply(this, rest), timeoutDelay);
  };
};

export {isEscapeKey, stopEventPropagation, showDataError, showMessage, getUniqueNumber, debounce};
