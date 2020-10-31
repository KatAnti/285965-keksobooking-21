'use strict';

const ESCAPE = `Escape`;
const MAX_ADS_COUNT = 5;
const mapElement = document.querySelector(`.map`);
const pinsContainerElement = mapElement.querySelector(`.map__pins`);
const adFormElement = document.querySelector(`.ad-form`);
const startPinElement = document.querySelector(`.map__pin--main`);
const filtersFormElement = document.querySelector(`.map__filters`);

window.constants = {
  escape: ESCAPE,
  maxAdsAmount: MAX_ADS_COUNT,
  filtersFormElement,
  mapElement,
  pinsContainerElement,
  adFormElement,
  startPinElement
};
