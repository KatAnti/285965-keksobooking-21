'use strict';

const ROOMS_MAX = `100`;
const TITLE_LENGTH_MIN = 30;
const TITLE_LENGTH_MAX = 100;
const MAX_PRICE = 1000000;
const HIGH_PRICE_MESSAGE = `Цена не может превышать ${MAX_PRICE}`;
const SHORT_TITLE_MESSAGE = `Описание должно быть не короче ${TITLE_LENGTH_MIN} символов`;
const LONG_TITLE_MESSAGE = `Вы достигли максимальной длины описания в ${TITLE_LENGTH_MAX} символов`;
const MinPrices = {
  bungalow: 0,
  flat: 1000,
  house: 5000,
  palace: 10000,
};
const mainElement = document.querySelector(`main`);
const roomNumberInput = window.constants.adFormElement.querySelector(`#room_number`);
const guestsAmountInput = window.constants.adFormElement.querySelector(`#capacity`);
const priceInput = window.constants.adFormElement.querySelector(`#price`);
const typeInput = window.constants.adFormElement.querySelector(`#type`);
const checkInInput = window.constants.adFormElement.querySelector(`#timein`);
const checkOutInput = window.constants.adFormElement.querySelector(`#timeout`);
const titleInput = window.constants.adFormElement.querySelector(`#title`);
const resetFormButton = window.constants.adFormElement.querySelector(`.ad-form__reset`);
const successMessageTemplate = document.querySelector(`#success`)
  .content
  .querySelector(`.success`);
const errorMessageTemplate = document.querySelector(`#error`)
  .content
  .querySelector(`.error`);

const setFormElementsState = (form, isDisabled) => {
  Array.from(form.children).forEach((element) => {
    element.disabled = isDisabled;
  });
};

const checkRoomsNumberCapacity = () => {
  guestsAmountInput.querySelectorAll(`option`).forEach((option) => {
    const isNotEnoughRooms = roomNumberInput.value < option.value;
    const isHundreedRooms = roomNumberInput.value === ROOMS_MAX;
    const isForGuests = option.value !== `0`;

    option.disabled = false;
    option.selected = true;

    if (isNotEnoughRooms && !isHundreedRooms ||
        isHundreedRooms && isForGuests ||
        !isHundreedRooms && !isForGuests
    ) {
      option.disabled = true;
      option.selected = false;
    }
  });
};

const syncMinPriceAndType = () => {
  priceInput.min = MinPrices[typeInput.value];
  priceInput.placeholder = `${MinPrices[typeInput.value]}`;
};

const validatePrice = () => {
  if (parseInt(priceInput.value, 10) > MAX_PRICE) {
    priceInput.setCustomValidity(HIGH_PRICE_MESSAGE);
  } else {
    priceInput.setCustomValidity(``);
  }

  priceInput.reportValidity();
};

const syncTime = (evt) => {
  if (evt.target && evt.target.matches(`#timein`)) {
    checkOutInput.value = evt.target.value;
  } else {
    checkInInput.value = evt.target.value;
  }
};

const validateTitle = () => {
  if (titleInput.value.length < TITLE_LENGTH_MIN) {
    titleInput.setCustomValidity(SHORT_TITLE_MESSAGE);
  } else if (titleInput.value.length === TITLE_LENGTH_MAX) {
    titleInput.setCustomValidity(LONG_TITLE_MESSAGE);
  } else {
    titleInput.setCustomValidity(``);
  }

  titleInput.reportValidity();
};

const deleteUploadedImages = () => {
  window.constants.adFormElement.querySelector(`.ad-form-header__preview img`).src = `img/muffin-grey.svg`;
  if (window.constants.adFormElement.querySelector(`.ad-form__photo img`)) {
    window.constants.adFormElement.querySelector(`.ad-form__photo img`).remove();
  }
};

const createMessagePopup = (template, onDocumentEsc, onDocumenClick) => {
  const message = template.cloneNode(true);
  mainElement.appendChild(message);
  document.addEventListener(`keydown`, onDocumentEsc);
  document.addEventListener(`click`, onDocumenClick);
};

const deleteMessagePopup = (popup, onDocumentEsc, onDocumenClick) => {
  popup.remove();
  document.removeEventListener(`keydown`, onDocumentEsc);
  document.removeEventListener(`click`, onDocumenClick);
};

const onDocumentEscClosePopup = (evt) => {
  const successElement = document.querySelector(`.success`);
  const errorElement = document.querySelector(`.error`);

  if (evt.key === window.constants.escape && successElement) {
    deleteMessagePopup(successElement, onDocumentEscClosePopup, onDocumentClickClosePopup);
  } else if (evt.key === window.constants.escape && errorElement) {
    deleteMessagePopup(errorElement, onDocumentEscClosePopup, onDocumentClickClosePopup);
  }
};

const onDocumentClickClosePopup = () => {
  const successElement = document.querySelector(`.success`);
  const errorElement = document.querySelector(`.error`);

  if (successElement) {
    deleteMessagePopup(successElement, onDocumentEscClosePopup, onDocumentClickClosePopup);
  } else if (errorElement) {
    deleteMessagePopup(errorElement, onDocumentEscClosePopup, onDocumentClickClosePopup);
  }
};

const errorHandler = () => {
  createMessagePopup(errorMessageTemplate, onDocumentEscClosePopup, onDocumentClickClosePopup);
};

const successHandler = () => {
  window.page.disactivate();
  createMessagePopup(successMessageTemplate, onDocumentEscClosePopup, onDocumentClickClosePopup);
};

const onFormSubmit = (evt) => {
  evt.preventDefault();

  window.backend.send(new FormData(window.constants.adFormElement), successHandler, errorHandler);
};

const onResetButtonClick = (evt) => {
  evt.preventDefault();
  window.page.disactivate();
};

titleInput.addEventListener(`input`, () => {
  validateTitle();
});

priceInput.addEventListener(`input`, () => {
  validatePrice();
});

roomNumberInput.addEventListener(`change`, () => {
  checkRoomsNumberCapacity();
});

typeInput.addEventListener(`change`, () => {
  syncMinPriceAndType();
});

checkInInput.addEventListener(`change`, (evt) => {
  syncTime(evt);
});

checkOutInput.addEventListener(`change`, (evt) => {
  syncTime(evt);
});

window.constants.adFormElement.addEventListener(`submit`, onFormSubmit);
resetFormButton.addEventListener(`click`, onResetButtonClick);

window.form = {
  setState: setFormElementsState,
  checkCapacity: checkRoomsNumberCapacity,
  syncMinPrice: syncMinPriceAndType,
  clearUploaded: deleteUploadedImages
};
