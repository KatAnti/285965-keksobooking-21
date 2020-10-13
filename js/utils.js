'use strict';

(() => {
  const map = document.querySelector(`.map`);
  const mapPinsContainer = map.querySelector(`.map__pins`);
  const adForm = document.querySelector(`.ad-form`);
  const startPin = document.querySelector(`.map__pin--main`);
  const filtersForm = document.querySelector(`.map__filters`);

  const getRandomNumber = (min, max) => {
    return Math.floor(min + Math.random() * (max + 1 - min));
  };

  const getRandomFeature = (arr) => {
    return arr[getRandomNumber(0, arr.length - 1)];
  };

  const getRandomLengthArray = (arr) => {
    const start = getRandomNumber(0, arr.length);
    const end = getRandomNumber(0, arr.length);
    if (start !== end) {
      return (start < end) ? arr.slice(start, end) : arr.slice(end, start);
    }

    return getRandomLengthArray(arr);
  };

  window.utils = {
    filtersFormElement: filtersForm,
    mapElement: map,
    pinsContainerElement: mapPinsContainer,
    adFormElement: adForm,
    startPinElement: startPin,
    randomNumber: getRandomNumber,
    randomFeature: getRandomFeature,
    randomLengthArray: getRandomLengthArray
  };
})();
