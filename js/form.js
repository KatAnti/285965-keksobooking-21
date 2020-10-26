'use strict';

(() => {
  const ROOMS_MAX = `100`;
  const TITLE_LENGTH_MIN = 30;
  const TITLE_LENGTH_MAX = 100;
  const BUNGALOW_MIN_PRICE = 0;
  const FLAT_MIN_PRICE = 1000;
  const HOUSE_MIN_PRICE = 5000;
  const PALACE_MIN_PRICE = 10000;
  const MAX_PRICE = 1000000;
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
    switch (typeInput.value) {
      case `bungalow`:
        priceInput.min = BUNGALOW_MIN_PRICE;
        priceInput.placeholder = `${BUNGALOW_MIN_PRICE}`;
        break;
      case `flat`:
        priceInput.min = FLAT_MIN_PRICE;
        priceInput.placeholder = `${FLAT_MIN_PRICE}`;
        break;
      case `house`:
        priceInput.min = HOUSE_MIN_PRICE;
        priceInput.placeholder = `${HOUSE_MIN_PRICE}`;
        break;
      case `palace`:
        priceInput.min = PALACE_MIN_PRICE;
        priceInput.placeholder = `${PALACE_MIN_PRICE}`;
        break;
    }
  };

  const validatePrice = () => {
    if (parseInt(priceInput.value, 10) > MAX_PRICE) {
      priceInput.setCustomValidity(`Цена не может превышать ${MAX_PRICE}`);
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
      titleInput.setCustomValidity(`Описание должно быть не короче ${TITLE_LENGTH_MIN} символов`);
    } else if (titleInput.value.length === TITLE_LENGTH_MAX) {
      titleInput.setCustomValidity(`Вы достигли максимальной длины описания в ${TITLE_LENGTH_MAX} символов`);
    } else {
      titleInput.setCustomValidity(``);
    }

    titleInput.reportValidity();
  };

  const disactivatePage = () => {
    window.constants.mapElement.classList.add(`map--faded`);
    setFormElementsState(window.constants.adFormElement, true);
    window.constants.adFormElement.classList.add(`ad-form--disabled`);
    window.map.closeCard();
    window.map.setInputAdress(window.constants.startPinElement.offsetLeft, window.constants.startPinElement.offsetTop, false);

    Array.from(window.constants.pinsContainerElement.children).forEach((element) => {
      if (element.matches(`.map__pin`) && !element.matches(`.map__pin--main`)) {
        element.remove();
      }
    });
  };

  const onDocumentEscCloseSuccessPopup = (evt) => {
    if (evt.key === window.constants.escape) {
      deleteMessagePopup(document.querySelector(`.success`), onDocumentEscCloseSuccessPopup, onDocumentClickCloseSuccessPopup);
    }
  };

  const onDocumentClickCloseSuccessPopup = () => {
    deleteMessagePopup(document.querySelector(`.success`), onDocumentEscCloseSuccessPopup, onDocumentClickCloseSuccessPopup);
  };

  const onDocumentEscCloseErrorPopup = (evt) => {
    if (evt.key === window.constants.escape) {
      deleteMessagePopup(document.querySelector(`.error`), onDocumentEscCloseErrorPopup, onDocumentClickCloseErrorPopup);
    }
  };

  const onDocumentClickCloseErrorPopup = () => {
    deleteMessagePopup(document.querySelector(`.error`), onDocumentEscCloseErrorPopup, onDocumentClickCloseErrorPopup);
  };

  const createMessagePopup = (template, onEsc, onClick) => {
    const message = template.cloneNode(true);
    mainElement.appendChild(message);
    document.addEventListener(`keydown`, onEsc);
    document.addEventListener(`click`, onClick);
  };

  const deleteMessagePopup = (popup, onEsc, onClick) => {
    popup.remove();
    document.removeEventListener(`keydown`, onEsc);
    document.removeEventListener(`click`, onClick);
  };

  const errorHandler = () => {
    createMessagePopup(errorMessageTemplate, onDocumentEscCloseErrorPopup, onDocumentClickCloseErrorPopup);
  };

  const successHandler = () => {
    window.constants.adFormElement.reset();
    disactivatePage();
    createMessagePopup(successMessageTemplate, onDocumentEscCloseSuccessPopup, onDocumentClickCloseSuccessPopup);
  };

  const onSubmitHandler = (evt) => {
    evt.preventDefault();

    window.backend.send(new FormData(window.constants.adFormElement), successHandler, errorHandler);
  };

  const onResetHandler = (evt) => {
    evt.preventDefault();
    window.constants.adFormElement.reset();
    window.map.setInputAdress(window.constants.startPinElement.offsetLeft, window.constants.startPinElement.offsetTop, true);
  };

  titleInput.addEventListener(`input`, () => {
    validateTitle();
  });

  priceInput.addEventListener(`input`, () => {
    validatePrice();
  });

  roomNumberInput.addEventListener(`click`, () => {
    checkRoomsNumberCapacity();
  });

  typeInput.addEventListener(`click`, () => {
    syncMinPriceAndType();
  });

  checkInInput.addEventListener(`click`, (evt) => {
    syncTime(evt);
  });

  checkOutInput.addEventListener(`click`, (evt) => {
    syncTime(evt);
  });

  window.constants.adFormElement.addEventListener(`submit`, onSubmitHandler);
  resetFormButton.addEventListener(`click`, onResetHandler);

  window.form = {
    setState: setFormElementsState,
    checkCapacity: checkRoomsNumberCapacity,
    syncMinPrice: syncMinPriceAndType
  };
})();
