'use strict';

const LEFT_BTN = 0;
const ENTER = `Enter`;
const IS_DISABLED = true;
const IS_PAGE_ACTIVE = true;

const activatePage = (evt) => {
  if (window.utils.mapElement.classList.contains(`map--faded`) && (evt.button === LEFT_BTN || evt.key === ENTER)) {
    window.utils.mapElement.classList.remove(`map--faded`);
    window.utils.adFormElement.classList.remove(`ad-form--disabled`);
    window.backend.load(window.map.sucsessHandler, window.map.errorHandler);
    window.form.setState(window.utils.adFormElement, !IS_DISABLED);
  }
};

window.form.setState(window.utils.adFormElement, IS_DISABLED);
window.form.setState(window.utils.filtersFormElement, IS_DISABLED);
window.map.setInputAdress(window.utils.startPinElement.offsetLeft, window.utils.startPinElement.offsetTop, !IS_PAGE_ACTIVE);
window.form.checkCapacity();
window.form.syncMinPrice();

window.utils.startPinElement.addEventListener(`mousedown`, (evt) => {
  activatePage(evt);
  window.map.setInputAdress(window.utils.startPinElement.offsetLeft, window.utils.startPinElement.offsetTop, IS_PAGE_ACTIVE);
  window.map.activateMainPin();
});

window.utils.startPinElement.addEventListener(`keydown`, (evt) => {
  activatePage(evt);
});


