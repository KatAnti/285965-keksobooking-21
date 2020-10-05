'use strict';

(() => {
  const START_PIN_WIDTH = 65;
  const START_PIN_HEIGHT = 87;
  const adress = document.querySelector(`#address`);
  const fragment = document.createDocumentFragment();
  /*
  const mapFilterContainer = document.querySelector(`.map__filters-container`);
  */

  const createPins = (adsArr) => {
    adsArr.forEach((ad) => {
      fragment.append(window.pin.render(ad));
    }
    );

    window.utils.pinsContainerElement.append(fragment);
  };

  const setMainPinAdress = (isPageActive) => {
    let x = parseInt(window.utils.startPinElement.style.left, 10);
    let y = parseInt(window.utils.startPinElement.style.top, 10);
    if (isPageActive) {
      x = x + START_PIN_WIDTH / 2;
      y = y + START_PIN_HEIGHT;
    }
    adress.value = `${Math.round(x)}, ${Math.round(y)}`;
  };

  window.map = {
    appendPins: createPins,
    setStartPinAdress: setMainPinAdress
  };
})();
