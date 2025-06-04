import {isEscapeKey, stopEventPropagation} from './utils.js';

const MAX_QUANTITY = 5;
const MAX_LENGTH = 140;

const body = document.querySelector('body ');
const loadForm = body.querySelector('.img-upload__form');
const loadInput = loadForm.querySelector('.img-upload__input');

const loadModal = loadForm.querySelector('.img-upload__overlay');
const loadModalClose = loadModal.querySelector('.img-upload__cancel');

const loadItemScale = loadModal.querySelector('.scale__control');
const loadItemEffectLevel = loadModal.querySelector('.effect-level__value');
const loadItemEffect = loadModal.querySelector('.effects__radio');
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

const resetLoadValues = () => {
  loadInput.value = '';
  loadItemScale.value = '100%';
  loadItemEffectLevel.value = '';
  loadItemEffect.checked = true;
  loadItemHashtags.value = '';
  loadItemDescription.value = '';
};

function openLoadModal() {
  body.classList.add('modal-open');
  loadModal.classList.remove('hidden');

  loadModalClose.addEventListener('click', closeLoadModal);
  document.addEventListener('keydown', onDocumentKeydown);

  loadItemHashtags.addEventListener('keydown', stopEventPropagation);
  loadItemDescription.addEventListener('keydown', stopEventPropagation);
}

function closeLoadModal() {
  body.classList.remove('modal-open');
  loadModal.classList.add('hidden');

  resetLoadValues();

  loadModalClose.removeEventListener('click', closeLoadModal);
  document.removeEventListener('keydown', onDocumentKeydown);

  loadItemHashtags.removeEventListener('keydown', stopEventPropagation);
  loadItemDescription.removeEventListener('keydown', stopEventPropagation);
}

loadInput.addEventListener('change', openLoadModal);

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
