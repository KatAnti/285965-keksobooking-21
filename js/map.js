'use strict';

(() => {
  const START_PIN_WIDTH = 62;
  const START_PIN_HEIGHT = 82;
  const INACTIVE_PIN_WIDTH = 65;
  const INACTIVE_PIN_HEIGHT = 65;
  const X_START = 0;
  const X_END = window.constants.pinsContainerElement.offsetWidth;
  const Y_START = 130;
  const Y_END = 630;
  const minLeft = X_START - START_PIN_WIDTH / 2;
  const maxRight = X_END - START_PIN_WIDTH / 2;
  const minTop = Y_START - START_PIN_HEIGHT;
  const maxBottom = Y_END - START_PIN_HEIGHT;
  const adressInput = document.querySelector(`#address`);
  const mapFilterElement = document.querySelector(`.map__filters-container`);

  const setInputAdress = (x, y, isPageActive) => {
    x = isPageActive ? x + START_PIN_WIDTH / 2 : x + INACTIVE_PIN_WIDTH / 2;
    y = isPageActive ? y + START_PIN_HEIGHT : y + INACTIVE_PIN_HEIGHT / 2;
    adressInput.value = `${Math.round(x)}, ${Math.round(y)}`;
  };

  const setMainPinCoords = (x, y) => {
    if (x) {
      window.constants.startPinElement.style.left = x + `px`;
    }
    if (y) {
      window.constants.startPinElement.style.top = y + `px`;
    }
  };

  const getMainPinCoords = {
    x: () => window.constants.startPinElement.offsetLeft,
    y: () => window.constants.startPinElement.offsetTop
  };

  const onPopupEscPress = (evt) => {
    if (evt.key === window.constants.escape) {
      evt.preventDefault();
      closeCard();
    }
  };

  const closeCard = () => {
    const popup = window.constants.mapElement.querySelector(`.popup`);
    if (popup) {
      popup.remove();
    }

    document.removeEventListener(`keypress`, onPopupEscPress);
  };

  const onPopupCloseClick = () => {
    closeCard();
  };

  const openCard = (adsArr, currentId) => {
    mapFilterElement.before(window.card.render(adsArr[currentId]));
    const closePopupBtn = window.constants.mapElement.querySelector(`.popup`)
      .querySelector(`.popup__close`);

    closePopupBtn.addEventListener(`click`, onPopupCloseClick);
    document.addEventListener(`keydown`, onPopupEscPress);
  };

  const createPins = (adsArr, maxNumber) => {
    const fragment = document.createDocumentFragment();

    Array.from(window.constants.pinsContainerElement.children).forEach((element) => {
      if (!element.matches(`.map__overlay`) && !element.matches(`.map__pin--main`)) {
        element.remove();
      }
    });

    for (let i = 0; i < maxNumber; i++) {
      fragment.append(window.pin.render(adsArr[i], i));
    }

    window.constants.pinsContainerElement.append(fragment);
  };

  const activateMainPin = () => {
    const onMouseMove = (mouseEvt) => {
      setMainPinCoords((getMainPinCoords.x() + mouseEvt.movementX), (getMainPinCoords.y() + mouseEvt.movementY));

      const preventPinCrossingBorder = (pinCoord, borderCoord, isMin) => {
        let coords = (pinCoord === `x`) ? {x: borderCoord, y: false} : {x: false, y: borderCoord};
        const isCrosingIndicator = isMin ? getMainPinCoords[pinCoord]() < borderCoord : getMainPinCoords[pinCoord]() > borderCoord;
        if (isCrosingIndicator) {
          window.constants.pinsContainerElement.removeEventListener(`mousemove`, onMouseMove);
          setMainPinCoords(coords.x, coords.y);
        }
      };

      preventPinCrossingBorder(`x`, minLeft, true);
      preventPinCrossingBorder(`x`, maxRight, false);
      preventPinCrossingBorder(`y`, minTop, true);
      preventPinCrossingBorder(`y`, maxBottom, false);

      window.constants.pinsContainerElement.addEventListener(`mouseleave`, () => {
        window.constants.pinsContainerElement.removeEventListener(`mousemove`, onMouseMove);
      });

      setInputAdress(getMainPinCoords.x(), getMainPinCoords.y(), true);
    };

    const onMouseUp = () => {
      window.constants.pinsContainerElement.removeEventListener(`mousemove`, onMouseMove);
      setInputAdress(getMainPinCoords.x(), getMainPinCoords.y(), true);
    };

    window.constants.pinsContainerElement.addEventListener(`mousemove`, onMouseMove);
    window.constants.pinsContainerElement.addEventListener(`mouseup`, onMouseUp);
  };

  window.map = {
    setInputAdress,
    activateMainPin,
    createPins,
    openCard,
    closeCard
  };
})();
