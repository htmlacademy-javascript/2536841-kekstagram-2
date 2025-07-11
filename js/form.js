import {isEscapeKey, onInputKeydown, showDataError, showMessage} from './utils.js';
import {sendData} from './api.js';

const MAX_QUANTITY = 5;
const MAX_LENGTH = 140;
const NO_EFFECTS = 'none';
const FILE_TYPES = ['jpeg', 'jpg', 'png'];
const HASHTAGS_REG_EXP = /^#[a-zа-яё0-9]{1,19}$/i;
const Scale = {
  STEP: 25,
  MIN: 25,
  MAX: 100,
};
const Error = {
  REG_EXP: 'Хэштеги должны начинаться с #, быть длиной до 20 символов, разделяться пробелом и состоять из букв или цифр',
  REPEAT: 'Хэштеги не должны повторяться',
  QUANTITY: `Не может быть больше ${MAX_QUANTITY} хэштегов`,
  LENGTH: `Длина комментария не может составлять больше ${MAX_LENGTH} символов`,
  TYPE: 'Неверный тип файла',
};
const SubmitButtonText = {
  IDLE: 'Опубликовать',
  SENDING: 'Публикую...'
};

const body = document.querySelector('body');
const form = body.querySelector('.img-upload__form');
const input = form.querySelector('.img-upload__input');

const modal = form.querySelector('.img-upload__overlay');
const modalClose = modal.querySelector('.img-upload__cancel');

const img = modal.querySelector('.img-upload__preview img');
const scaleInput = modal.querySelector('.scale__control--value');
const decreaseButton = modal.querySelector('.scale__control--smaller');
const increaseButton = modal.querySelector('.scale__control--bigger');

const effectRangeContainer = modal.querySelector('.img-upload__effect-level');
const effectInput = effectRangeContainer.querySelector('.effect-level__value');
const effectRange = effectRangeContainer.querySelector('.effect-level__slider');
const effects = modal.querySelectorAll('.effects__radio');
const effectsPreviews = modal.querySelectorAll('.effects__preview');
const settings = {
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

const hashtagsInput = modal.querySelector('.text__hashtags');
const descriptionInput = modal.querySelector('.text__description');

const submitButton = modal.querySelector('.img-upload__submit');
const successMessage = body.querySelector('#success').content.querySelector('.success').cloneNode(true);
const errorMessage = body.querySelector('#error').content.querySelector('.error').cloneNode(true);

const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorClass: 'img-upload__field-wrapper--error',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextTag: 'div',
  errorTextClass: 'img-upload__error'
});

const onDocumentKeydown = (evt) => {
  if (isEscapeKey(evt) && !evt.target.contains(errorMessage)) {
    evt.preventDefault();
    onModalClose();
  }
};

const updateRangeOptions = (options) => effectRange.noUiSlider.updateOptions(options);

let currentEffect = NO_EFFECTS;
const resetLoadValues = () => {
  input.value = '';
  scaleInput.value = '100%';
  hashtagsInput.value = '';
  descriptionInput.value = '';

  img.style.transform = 'scale(1)';
  img.className = '';
  img.style.filter = NO_EFFECTS;
  img.src = '';

  effectInput.value = '';
  effects[0].checked = true;
  effectsPreviews.forEach((effectPreview) => {
    effectPreview.style.backgroundImage = '';
  });
  currentEffect = NO_EFFECTS;

  updateRangeOptions({
    range: {
      min: 0,
      max: 1,
    },
    start: 1,
    step: 0.1,
  });

  pristine.reset();
};

const onImageScale = (evt) => {
  let value = Number(scaleInput.value.replace(/\D+/g, ''));
  if (evt.target === decreaseButton && value > Scale.MIN) {
    value -= Scale.STEP;
  } else if (evt.target === increaseButton && value < Scale.MAX) {
    value += Scale.STEP;
  }
  scaleInput.value = `${value}%`;
  img.style.transform = `scale(${value / 100})`;
};

const openModal = () => {
  body.classList.add('modal-open');
  modal.classList.remove('hidden');

  modalClose.addEventListener('click', onModalClose);
  document.addEventListener('keydown', onDocumentKeydown);

  decreaseButton.addEventListener('click', onImageScale);
  increaseButton.addEventListener('click', onImageScale);
  hashtagsInput.addEventListener('keydown', onInputKeydown);
  descriptionInput.addEventListener('keydown', onInputKeydown);

  effectRangeContainer.classList.add('visually-hidden');
};

function onModalClose() {
  body.classList.remove('modal-open');
  modal.classList.add('hidden');

  resetLoadValues();

  modalClose.removeEventListener('click', onModalClose);
  document.removeEventListener('keydown', onDocumentKeydown);

  decreaseButton.removeEventListener('click', onImageScale);
  increaseButton.removeEventListener('click', onImageScale);
  hashtagsInput.removeEventListener('keydown', onInputKeydown);
  descriptionInput.removeEventListener('keydown', onInputKeydown);
}

const onInputChange = () => {
  const file = input.files[0];
  const fileExt = file.name.toLowerCase().split('.').pop();
  const isMatches = FILE_TYPES.includes(fileExt);
  if (isMatches) {
    const imageUrl = URL.createObjectURL(file);
    img.src = imageUrl;
    effectsPreviews.forEach((effectPreview) => {
      effectPreview.style.backgroundImage = `url('${imageUrl}')`;
    });
    openModal();
  } else {
    showDataError(Error.TYPE);
  }
};

input.addEventListener('change', onInputChange);

noUiSlider.create(effectRange, {
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

const getCurrentEffect = () => `${settings[currentEffect]?.style}(${effectInput.value}${settings[currentEffect]?.unit})`;

effectRange.noUiSlider.on('update', () => {
  effectInput.value = effectRange.noUiSlider.get();
  img.style.filter = getCurrentEffect();
});

const onEffectChange = (evt) => {
  img.className = '';
  currentEffect = evt.target.value;

  if (currentEffect === NO_EFFECTS) {
    img.style.filter = NO_EFFECTS;
    effectRangeContainer.classList.add('visually-hidden');
    return;
  }

  img.classList.add(`effects__preview--${evt.target.value}`);
  effectRangeContainer.classList.remove('visually-hidden');
  updateRangeOptions(settings[evt.target.value].options);
};

effects.forEach((effect) => effect.addEventListener('change', onEffectChange));

let hashtagsError;
const getHashtagsError = () => hashtagsError;

const validateHashtags = (value) => {
  if (!value) {
    return true;
  }

  const hashtagsList = value.trim().toLowerCase().split(/\s+/);
  if (hashtagsList.length > MAX_QUANTITY) {
    hashtagsError = Error.QUANTITY;
    return false;
  } else if (hashtagsList.length !== new Set(hashtagsList).size) {
    hashtagsError = Error.REPEAT;
    return false;
  }
  for (let i = 0; i < hashtagsList.length; i++) {
    if (!HASHTAGS_REG_EXP.test(hashtagsList[i])) {
      hashtagsError = Error.REG_EXP;
      return false;
    }
  }

  return true;
};

const validateDescription = (value) => value.length <= MAX_LENGTH;

pristine.addValidator(hashtagsInput, validateHashtags, getHashtagsError);
pristine.addValidator(descriptionInput, validateDescription, Error.LENGTH);

form.addEventListener('submit', (evt) => {
  evt.preventDefault();

  if (pristine.validate()) {
    submitButton.disabled = true;
    submitButton.textContent = SubmitButtonText.SENDING;
    sendData(new FormData(form))
      .then(() => {
        onModalClose();
        showMessage('success', successMessage);
      })
      .catch(() => showMessage('error', errorMessage))
      .finally(() => {
        submitButton.disabled = false;
        submitButton.textContent = SubmitButtonText.IDLE;
      });
  }
});
