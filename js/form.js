'use strict';

(() => {
  const ROOMS_MAX = `100`;
  const TITLE_LENGTH_MIN = 30;
  const TITLE_LENGTH_MAX = 100;
  const BUNGALOW_MIN_PRICE = 0;
  const FLAT_MIN_PRICE = 1000;
  const HOUSE_MIN_PRICE = 5000;
  const PALACE_MIN_PRICE = 10000;
  const roomNumberInput = window.utils.adFormElement.querySelector(`#room_number`);
  const guestsAmountInput = window.utils.adFormElement.querySelector(`#capacity`);
  const priceInput = window.utils.adFormElement.querySelector(`#price`);
  const typeInput = window.utils.adFormElement.querySelector(`#type`);
  const checkInInput = window.utils.adFormElement.querySelector(`#timein`);
  const checkOutInput = window.utils.adFormElement.querySelector(`#timeout`);
  const titleInput = window.utils.adFormElement.querySelector(`#title`);

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
    if (parseInt(priceInput.value, 10) > window.mockData.priceMax) {
      priceInput.setCustomValidity(`Цена не может превышать ${window.mockData.priceMax}`);
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

  window.form = {
    setState: setFormElementsState,
    checkCapacity: checkRoomsNumberCapacity,
    syncMinPrice: syncMinPriceAndType
  };
})();
