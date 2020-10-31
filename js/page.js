'use strict';

let adsFiltered = [];
const LEFT_BTN = 0;

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
    window.form.setState(window.constants.adFormElement, false);
  }
};

window.page = {
  activate: activatePage,
  getFilteredAds: () => {
    return adsFiltered;
  },
};
