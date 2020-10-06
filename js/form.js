'use strict';

(() => {
  const ROOMS_MAX = `100`;
  const roomNumberInput = window.utils.adFormElement.querySelector(`#room_number`);
  const guestsAmountInput = window.utils.adFormElement.querySelector(`#capacity`);

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

  roomNumberInput.addEventListener(`click`, () => {
    checkRoomsNumberCapacity();
  });

  window.form = {
    setState: setFormElementsState,
    checkCapacity: checkRoomsNumberCapacity
  };
})();
