import {isEscapeKey, stopEventPropagation} from './utils.js';

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

const hashtagsMaxQuantity = 5;
const hashtagsFieldRegExp = /^#[a-zа-яё0-9]{1,19}$/i;
const hashtagsFieldRegExpError = 'Хэштеги должны начинаться с #, быть длиной до 20 символов, разделяться пробелом и состоять из букв или цифр';
const hashtagsFieldRepeatError = 'Хэштеги не должны повторяться';
const hashtagsFieldQuantityError = `Не может быть больше ${hashtagsMaxQuantity} хэштегов`;

const descriptionFieldMaxLength = 140;
const descriptionFieldError = `Длина комментария не может составлять больше ${descriptionFieldMaxLength} символов`;

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

  const normalizeValue = value.replace(/\B\s+|\s+\B/g, ' ').trim().toLowerCase();
  const hashtagsList = normalizeValue.split(' ');

  if (hashtagsList.length > hashtagsMaxQuantity) {
    validateHashtagsError = hashtagsFieldQuantityError;
    return false;
  } else if (hashtagsList.length !== new Set(hashtagsList).size) {
    validateHashtagsError = hashtagsFieldRepeatError;
    return false;
  }
  for (let i = 0; i < hashtagsList.length; i++) {
    if (!hashtagsFieldRegExp.test(hashtagsList[i])) {
      validateHashtagsError = hashtagsFieldRegExpError;
      return false;
    }
  }

  return true;
};

const validateDescription = (value) => value.length <= descriptionFieldMaxLength;

pristine.addValidator(loadItemHashtags, validateHashtags, getHashtagsError);
pristine.addValidator(loadItemDescription, validateDescription, descriptionFieldError);

loadForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  pristine.validate();
});
