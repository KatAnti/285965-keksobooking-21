'use strict';

const LEFT_BTN = 0;
const ENTER = `Enter`;
const IS_DISABLED = true;
const IS_PAGE_ACTIVE = true;
let ads = [];

const setDataId = (arr) => {
  arr.forEach((item, index) => {
    item.index = index;
  });
};

const successHandler = (adsArr) => {
  ads = adsArr;
  setDataId(ads);

  window.form.setState(window.utils.filtersFormElement, false);

  window.map.createPins(ads, window.utils.maxAdsAmount);

  window.utils.pinsContainerElement.addEventListener(`click`, (evt) => {
    if (evt.target && evt.target.matches(`.map__pin`) && !evt.target.matches(`.map__pin--main`)) {
      const pins = document.querySelectorAll(`.map__pin`);

      pins.forEach((pin) => {
        pin.classList.remove(`map__pin--active`);
      });

      window.map.closeCard();
      window.map.openCard(ads, evt.target.dataset.id);
      evt.target.classList.add(`map__pin--active`);
    }
  });
};

const activatePage = (evt) => {
  if (window.utils.mapElement.classList.contains(`map--faded`) && (evt.button === LEFT_BTN || evt.key === ENTER)) {
    window.utils.mapElement.classList.remove(`map--faded`);
    window.utils.adFormElement.classList.remove(`ad-form--disabled`);
    window.backend.load(successHandler, window.map.errorHandler);
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
  window.filter.setSelectChangeHandler(() => {
    window.filter.start(ads);
  });
});

window.utils.startPinElement.addEventListener(`keydown`, (evt) => {
  activatePage(evt);
});


