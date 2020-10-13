'use strict';

(() => {
  const ESCAPE = `Escape`;
  const START_PIN_WIDTH = 62;
  const START_PIN_HEIGHT = 82;
  const MAX_ADS_COUNT = 5;
  const X_START = 0;
  const X_END = window.utils.pinsContainerElement.offsetWidth;
  const Y_START = 130;
  const Y_END = 630;
  const MIN_LEFT = X_START - START_PIN_WIDTH / 2;
  const MAX_RIGHT = X_END - START_PIN_WIDTH / 2;
  const MIN_TOP = Y_START - START_PIN_HEIGHT;
  const MAX_BOTTOM = Y_END - START_PIN_HEIGHT;
  const adress = document.querySelector(`#address`);
  const mapFilterContainer = document.querySelector(`.map__filters-container`);

  const setAdress = (x, y) => {
    x = x + START_PIN_WIDTH / 2;
    y = y + START_PIN_HEIGHT;
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

  const openPopup = (ads, currentId) => {
    mapFilterContainer.before(window.card.render(ads[currentId]));
    const closePopupBtn = window.utils.mapElement.querySelector(`.popup`)
      .querySelector(`.popup__close`);

    closePopupBtn.addEventListener(`click`, onPopupCloseClick);
    document.addEventListener(`keydown`, onPopupEscPress);
  };

  const drawMapOnSucessLoad = (ads) => {
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < MAX_ADS_COUNT; i++) {
      fragment.append(window.pin.render(ads[i], i));
    }

    window.form.setState(window.utils.filtersFormElement, false);

    window.utils.pinsContainerElement.append(fragment);
    window.utils.pinsContainerElement.addEventListener(`click`, (evt) => {
      if (evt.target && evt.target.matches(`.map__pin`) && !evt.target.matches(`.map__pin--main`)) {
        const pins = document.querySelectorAll(`.map__pin`);

        pins.forEach((pin) => {
          pin.classList.remove(`map__pin--active`);
        });

        closePopup();
        openPopup(ads, evt.target.dataset.id);
        evt.target.classList.add(`map__pin--active`);
      }
    });
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

      preventPinCrossingBorder(`x`, MIN_LEFT, true);
      preventPinCrossingBorder(`x`, MAX_RIGHT, false);
      preventPinCrossingBorder(`y`, MIN_TOP, true);
      preventPinCrossingBorder(`y`, MAX_BOTTOM, false);

      window.utils.pinsContainerElement.addEventListener(`mouseleave`, () => {
        window.utils.pinsContainerElement.removeEventListener(`mousemove`, onMouseMove);
      });

      window.map.setInputAdress(getMainPinCoords.x(), getMainPinCoords.y());
    };

    const onMouseUp = () => {
      window.utils.pinsContainerElement.removeEventListener(`mousemove`, onMouseMove);
      window.map.setInputAdress(window.utils.startPinElement.offsetLeft, window.utils.startPinElement.offsetTop);
    };

    window.utils.pinsContainerElement.addEventListener(`mousemove`, onMouseMove);
    window.utils.pinsContainerElement.addEventListener(`mouseup`, onMouseUp);
  };

  window.map = {
    sucsessHandler: drawMapOnSucessLoad,
    errorHandler: showErrorMessage,
    setInputAdress: setAdress,
    activateMainPin: makeMainPinMovable
  };
})();
