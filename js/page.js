'use strict';
const IS_DISABLED = true;
const LEFT_BTN = 0;
let adsFiltered = [];
const StartCoordinates = {
  x: 570,
  y: 375
};

const setDataId = (arr) => {
  arr.forEach((item, index) => {
    item.index = index;
  });
};

const successHandler = (adsArr) => {
  adsFiltered = adsArr.slice();
  setDataId(adsFiltered);

  window.form.setState(window.constants.filtersFormElement, false);

  window.map.createPins(adsFiltered, window.constants.maxAdsAmount);

  window.constants.pinsContainerElement.addEventListener(`click`, (evt) => {
    if (evt.target && evt.target.matches(`.map__pin`) && !evt.target.matches(`.map__pin--main`)) {
      const pins = document.querySelectorAll(`.map__pin`);

      pins.forEach((pin) => {
        pin.classList.remove(`map__pin--active`);
      });

      window.map.closeCard();
      window.map.openCard(adsFiltered, evt.target.dataset.id);
      evt.target.classList.add(`map__pin--active`);
    }
  });
};

const errorHandler = (errorMessage) => {
  const node = document.createElement(`div`);
  node.style = `z-index: 100; margin: 0 auto; text-align: center; background-color: rgba(255, 86, 53, 0.7);`;
  node.style.position = `absolute`;
  node.style.left = 0;
  node.style.right = 0;
  node.style.fontSize = `20px`;

  node.textContent = errorMessage;
  document.body.insertAdjacentElement(`afterbegin`, node);
};

const activatePage = (evt) => {
  if (window.constants.mapElement.classList.contains(`map--faded`) && (evt.button === LEFT_BTN || evt.key === window.constants.escape)) {
    window.constants.mapElement.classList.remove(`map--faded`);
    window.constants.adFormElement.classList.remove(`ad-form--disabled`);
    window.backend.load(successHandler, errorHandler);
    window.form.setState(window.constants.adFormElement, !IS_DISABLED);
    window.form.setState(window.constants.filtersFormElement, !IS_DISABLED);
  }
};

const disactivatePage = () => {
  window.constants.adFormElement.reset();
  window.constants.filtersFormElement.reset();
  window.constants.mapElement.classList.add(`map--faded`);
  window.constants.adFormElement.classList.add(`ad-form--disabled`);
  window.form.setState(window.constants.adFormElement, IS_DISABLED);
  window.form.setState(window.constants.filtersFormElement, IS_DISABLED);
  window.form.clearUploaded();
  window.form.syncMinPrice();
  window.map.closeCard();
  window.map.setMainPinCoords(StartCoordinates.x, StartCoordinates.y);
  window.map.setInputAdress(window.constants.startPinElement.offsetLeft, window.constants.startPinElement.offsetTop, false);

  Array.from(window.constants.pinsContainerElement.children).forEach((element) => {
    if (element.matches(`.map__pin`) && !element.matches(`.map__pin--main`)) {
      element.remove();
    }
  });
};

window.page = {
  activate: activatePage,
  disactivate: disactivatePage,
  getFilteredAds: () => {
    return adsFiltered;
  },
};
