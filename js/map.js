'use strict';

(() => {
  const ESCAPE = `Escape`;
  const START_PIN_WIDTH = 62;
  const START_PIN_HEIGHT = 82;
  const INACTIVE_PIN_WIDTH = 65;
  const INACTIVE_PIN_HEIGHT = 65;
  const X_START = 0;
  const X_END = window.utils.pinsContainerElement.offsetWidth;
  const Y_START = 130;
  const Y_END = 630;
  const minLeft = X_START - START_PIN_WIDTH / 2;
  const maxRight = X_END - START_PIN_WIDTH / 2;
  const minTop = Y_START - START_PIN_HEIGHT;
  const maxBottom = Y_END - START_PIN_HEIGHT;
  const adress = document.querySelector(`#address`);
  const mapFilterContainer = document.querySelector(`.map__filters-container`);

  const setAdress = (x, y, isPageActive) => {
    x = isPageActive ? x + START_PIN_WIDTH / 2 : x + INACTIVE_PIN_WIDTH / 2;
    y = isPageActive ? y + START_PIN_HEIGHT : y + INACTIVE_PIN_HEIGHT / 2;
    adress.value = `${Math.round(x)}, ${Math.round(y)}`;
  };

  const setMainPinCoords = (x, y) => {
    if (x) {
      window.utils.startPinElement.style.left = x + `px`;
    }
    if (y) {
      window.utils.startPinElement.style.top = y + `px`;
    }
  };

  const getMainPinCoords = {
    x: () => window.utils.startPinElement.offsetLeft,
    y: () => window.utils.startPinElement.offsetTop
  };

  const onPopupEscPress = (evt) => {
    if (evt.key === ESCAPE) {
      evt.preventDefault();
      closePopup();
    }
  };

  const closePopup = () => {
    const popup = window.utils.mapElement.querySelector(`.popup`);
    if (popup) {
      popup.remove();
    }

    document.removeEventListener(`keypress`, onPopupEscPress);
  };

  const onPopupCloseClick = () => {
    closePopup();
  };

  const openPopup = (adsArr, currentId) => {
    mapFilterContainer.before(window.card.render(adsArr[currentId]));
    const closePopupBtn = window.utils.mapElement.querySelector(`.popup`)
      .querySelector(`.popup__close`);

    closePopupBtn.addEventListener(`click`, onPopupCloseClick);
    document.addEventListener(`keydown`, onPopupEscPress);
  };

  const renderPins = (adsArr, maxNumber) => {
    const fragment = document.createDocumentFragment();

    Array.from(window.utils.pinsContainerElement.children).forEach((element) => {
      if (!element.matches(`.map__overlay`) && !element.matches(`.map__pin--main`)) {
        element.remove();
      }
    });

    for (let i = 0; i < maxNumber; i++) {
      fragment.append(window.pin.render(adsArr[i]));
    }

    window.utils.pinsContainerElement.append(fragment);
  };

  const showErrorMessage = (errorMessage) => {
    const node = document.createElement(`div`);
    node.style = `z-index: 100; margin: 0 auto; text-align: center; background-color: rgba(255, 86, 53, 0.7);`;
    node.style.position = `absolute`;
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = `20px`;

    node.textContent = errorMessage;
    document.body.insertAdjacentElement(`afterbegin`, node);
  };

  const makeMainPinMovable = () => {
    const onMouseMove = (mouseEvt) => {
      setMainPinCoords((getMainPinCoords.x() + mouseEvt.movementX), (getMainPinCoords.y() + mouseEvt.movementY));

      const preventPinCrossingBorder = (pinCoord, borderCoord, isMin) => {
        let coords = (pinCoord === `x`) ? {x: borderCoord, y: false} : {x: false, y: borderCoord};
        const isCrosingIndicator = isMin ? getMainPinCoords[pinCoord]() < borderCoord : getMainPinCoords[pinCoord]() > borderCoord;
        if (isCrosingIndicator) {
          window.utils.pinsContainerElement.removeEventListener(`mousemove`, onMouseMove);
          setMainPinCoords(coords.x, coords.y);
        }
      };

      preventPinCrossingBorder(`x`, minLeft, true);
      preventPinCrossingBorder(`x`, maxRight, false);
      preventPinCrossingBorder(`y`, minTop, true);
      preventPinCrossingBorder(`y`, maxBottom, false);

      window.utils.pinsContainerElement.addEventListener(`mouseleave`, () => {
        window.utils.pinsContainerElement.removeEventListener(`mousemove`, onMouseMove);
      });

      setAdress(getMainPinCoords.x(), getMainPinCoords.y(), true);
    };

    const onMouseUp = () => {
      window.utils.pinsContainerElement.removeEventListener(`mousemove`, onMouseMove);
      setAdress(getMainPinCoords.x(), getMainPinCoords.y(), true);
    };

    window.utils.pinsContainerElement.addEventListener(`mousemove`, onMouseMove);
    window.utils.pinsContainerElement.addEventListener(`mouseup`, onMouseUp);
  };

  window.map = {
    errorHandler: showErrorMessage,
    setInputAdress: setAdress,
    activateMainPin: makeMainPinMovable,
    createPins: renderPins,
    openCard: openPopup,
    closeCard: closePopup,
  };
})();
