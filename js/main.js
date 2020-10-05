'use strict';

const ADS_AMOUNT = 8;
const ads = [];
const LEFT_BTN = 0;
const ENTER = `Enter`;
const IS_DISABLED = true;
const IS_ACTIVE = true;
const filtersForm = document.querySelector(`.map__filters`);

const activatePage = (evt) => {
  if (window.utils.mapElement.classList.contains(`map--faded`) && (evt.button === LEFT_BTN || evt.key === ENTER)) {
    window.utils.mapElement.classList.remove(`map--faded`);
    window.utils.adFormElement.classList.remove(`ad-form--disabled`);
    window.map.appendPins(ads);
    window.form.setState(window.utils.adFormElement, false);
    window.form.setState(filtersForm, false);
  }
};

for (let i = 0; i < ADS_AMOUNT; i++) {
  ads.push(window.adData.create());
}

window.form.setState(window.utils.adFormElement, IS_DISABLED);
window.form.setState(filtersForm, IS_DISABLED);
window.map.setStartPinAdress(!IS_ACTIVE);
window.form.checkCapacity();

window.utils.startPinElement.addEventListener(`mousedown`, (evt) => {
  activatePage(evt);
  window.map.setStartPinAdress(IS_ACTIVE);
});

window.utils.startPinElement.addEventListener(`keydown`, (evt) => {
  activatePage(evt);
});


