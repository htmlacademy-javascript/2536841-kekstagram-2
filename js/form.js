import {isEscapeKey, stopEventPropagation} from './utils.js';

const MAX_QUANTITY = 5;
const MAX_LENGTH = 140;
const NO_EFFECTS = 'none';

const body = document.querySelector('body');
const loadForm = body.querySelector('.img-upload__form');
const loadInput = loadForm.querySelector('.img-upload__input');

const loadModal = loadForm.querySelector('.img-upload__overlay');
const loadModalClose = loadModal.querySelector('.img-upload__cancel');

const loadItemSmaller = loadModal.querySelector('.scale__control--smaller');
const loadItemBigger = loadModal.querySelector('.scale__control--bigger');
const loadItemInput = loadModal.querySelector('.scale__control--value');
const loadItemImage = loadModal.querySelector('.img-upload__preview img');
const Scales = {
  STEP: 25,
  MIN: 25,
  MAX: 100,
};

const loadItemRangeContainer = loadModal.querySelector('.img-upload__effect-level');
const loadItemRange = loadItemRangeContainer.querySelector('.effect-level__slider');
const loadItemEffectLevel = loadItemRangeContainer.querySelector('.effect-level__value');
const loadItemEffects = loadModal.querySelectorAll('.effects__radio');
const Effects = {
  chrome: {
    options: {
      range: {
        min: 0,
        max: 1,
      },
      start: 1,
      step: 0.1,
    },
    style: 'grayscale',
    unit: '',
  },
  sepia: {
    options: {
      range: {
        min: 0,
        max: 1,
      },
      start: 1,
      step: 0.1,
    },
    style: 'sepia',
    unit: '',
  },
  marvin: {
    options: {
      range: {
        min: 0,
        max: 100,
      },
      start: 100,
      step: 1,
    },
    style: 'invert',
    unit: '%',
  },
  phobos: {
    options: {
      range: {
        min: 0,
        max: 3,
      },
      start: 3,
      step: 0.1,
    },
    style: 'blur',
    unit: 'px',
  },
  heat: {
    options: {
      range: {
        min: 1,
        max: 3,
      },
      start: 3,
      step: 0.1,
    },
    style: 'brightness',
    unit: '',
  },
};

const loadItemHashtags = loadModal.querySelector('.text__hashtags');
const loadItemDescription = loadModal.querySelector('.text__description');
const hashtagsFieldRegExp = /^#[a-zа-яё0-9]{1,19}$/i;
const Errors = {
  REGEXP: 'Хэштеги должны начинаться с #, быть длиной до 20 символов, разделяться пробелом и состоять из букв или цифр',
  REPEAT: 'Хэштеги не должны повторяться',
  QUANTITY: `Не может быть больше ${MAX_QUANTITY} хэштегов`,
  LENGTH: `Длина комментария не может составлять больше ${MAX_LENGTH} символов`,
};

const onDocumentKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeLoadModal();
  }
};

const updateRangeOptions = (options) => loadItemRange.noUiSlider.updateOptions(options);

let currentEffect = NO_EFFECTS;
const resetLoadValues = () => {
  loadInput.value = '';

  loadItemInput.value = '100%';
  loadItemImage.style.transform = 'scale(1)';

  loadItemEffects[0].checked = true;
  loadItemImage.className = '';
  currentEffect = NO_EFFECTS;
  loadItemImage.style.filter = NO_EFFECTS;
  loadItemEffectLevel.value = '';
  updateRangeOptions({
    range: {
      min: 0,
      max: 1,
    },
    start: 1,
    step: 0.1,
  });

  loadItemHashtags.value = '';
  loadItemDescription.value = '';
};

const transformLoadImage = (evt) => {
  let value = Number(loadItemInput.value.replace(/\D+/g, ''));
  if (evt.target === loadItemSmaller && value > Scales.MIN) {
    value -= Scales.STEP;
  } else if (evt.target === loadItemBigger && value < Scales.MAX) {
    value += Scales.STEP;
  }
  loadItemInput.value = `${value}%`;
  loadItemImage.style.transform = `scale(${value / 100})`;
};

function openLoadModal() {
  body.classList.add('modal-open');
  loadModal.classList.remove('hidden');

  loadModalClose.addEventListener('click', closeLoadModal);
  document.addEventListener('keydown', onDocumentKeydown);

  loadItemSmaller.addEventListener('click', transformLoadImage);
  loadItemBigger.addEventListener('click', transformLoadImage);
  loadItemHashtags.addEventListener('keydown', stopEventPropagation);
  loadItemDescription.addEventListener('keydown', stopEventPropagation);

  loadItemRangeContainer.classList.add('visually-hidden');
}

function closeLoadModal() {
  body.classList.remove('modal-open');
  loadModal.classList.add('hidden');

  resetLoadValues();

  loadModalClose.removeEventListener('click', closeLoadModal);
  document.removeEventListener('keydown', onDocumentKeydown);

  loadItemSmaller.removeEventListener('click', transformLoadImage);
  loadItemBigger.removeEventListener('click', transformLoadImage);
  loadItemHashtags.removeEventListener('keydown', stopEventPropagation);
  loadItemDescription.removeEventListener('keydown', stopEventPropagation);
}

loadInput.addEventListener('change', openLoadModal);

noUiSlider.create(loadItemRange, {
  range: {
    min: 0,
    max: 1,
  },
  start: 1,
  step: 0.1,
  format: {
    to: function (value) {
      if (Number.isInteger(value)) {
        return value.toFixed(0);
      }
      return value.toFixed(1);
    },
    from: function (value) {
      return parseFloat(value);
    },
  },
  connect: 'lower',
});

const getCurrentEffect = () => `${Effects[currentEffect]?.style}(${loadItemEffectLevel.value}${Effects[currentEffect]?.unit})`;

loadItemRange.noUiSlider.on('update', () => {
  loadItemEffectLevel.value = loadItemRange.noUiSlider.get();
  loadItemImage.style.filter = getCurrentEffect();
});

loadItemEffects.forEach((effect) => {
  effect.addEventListener('change', () => {
    loadItemImage.className = '';
    currentEffect = effect.value;

    if (currentEffect === NO_EFFECTS) {
      loadItemImage.style.filter = NO_EFFECTS;
      loadItemRangeContainer.classList.add('visually-hidden');
      return;
    }

    loadItemImage.classList.add(`effects__preview--${effect.value}`);
    loadItemRangeContainer.classList.remove('visually-hidden');
    updateRangeOptions(Effects[effect.value].options);
  });
});

const pristine = new Pristine(loadForm, {
  classTo: 'img-upload__field-wrapper',
  errorClass: 'img-upload__field-wrapper--error',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextTag: 'div',
  errorTextClass: 'img-upload__error'
});

let validateHashtagsError;
const getHashtagsError = () => validateHashtagsError;

const validateHashtags = (value) => {
  if (!value) {
    return true;
  }

  const normalizeValue = value.trim().toLowerCase();
  const hashtagsList = normalizeValue.split(/\s+/);

  if (hashtagsList.length > MAX_QUANTITY) {
    validateHashtagsError = Errors.QUANTITY;
    return false;
  } else if (hashtagsList.length !== new Set(hashtagsList).size) {
    validateHashtagsError = Errors.REPEAT;
    return false;
  }
  for (let i = 0; i < hashtagsList.length; i++) {
    if (!hashtagsFieldRegExp.test(hashtagsList[i])) {
      validateHashtagsError = Errors.REGEXP;
      return false;
    }
  }

  return true;
};

const validateDescription = (value) => value.length <= MAX_LENGTH;

pristine.addValidator(loadItemHashtags, validateHashtags, getHashtagsError);
pristine.addValidator(loadItemDescription, validateDescription, Errors.LENGTH);

loadForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  pristine.validate();
});
