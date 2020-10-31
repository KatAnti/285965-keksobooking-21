'use strict';

const IS_DISABLED = true;
const IS_PAGE_ACTIVE = true;

window.form.setState(window.constants.adFormElement, IS_DISABLED);
window.form.setState(window.constants.filtersFormElement, IS_DISABLED);
window.map.setInputAdress(window.constants.startPinElement.offsetLeft, window.constants.startPinElement.offsetTop, !IS_PAGE_ACTIVE);
window.form.checkCapacity();
window.form.syncMinPrice();

window.constants.startPinElement.addEventListener(`mousedown`, (evt) => {
  window.page.activate(evt);
  window.map.setInputAdress(window.constants.startPinElement.offsetLeft, window.constants.startPinElement.offsetTop, IS_PAGE_ACTIVE);
  window.map.activateMainPin();
  window.filter.setSelectChangeHandler(window.debounce(() => {
    window.filter.start(window.page.getFilteredAds());
  }));
  window.filter.setInputChangeHandler(window.debounce(() => {
    window.filter.start(window.page.getFilteredAds());
  }));
});

window.constants.startPinElement.addEventListener(`keydown`, (evt) => {
  window.page.activate(evt);
});
