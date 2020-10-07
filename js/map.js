'use strict';

(() => {
  const ESCAPE = `Escape`;
  const START_PIN_WIDTH = 65;
  const START_PIN_HEIGHT = 87;
  const adress = document.querySelector(`#address`);
  const fragment = document.createDocumentFragment();
  const mapFilterContainer = document.querySelector(`.map__filters-container`);

  const createPins = (adsArr) => {
    adsArr.forEach((ad, i) => {
      fragment.append(window.pin.render(ad, i));
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

  const openPopup = (currentId) => {
    mapFilterContainer.before(window.card.render(window.adsData.getArr[currentId]));
    const closePopupBtn = window.utils.mapElement.querySelector(`.popup`)
      .querySelector(`.popup__close`);

    closePopupBtn.addEventListener(`click`, onPopupCloseClick);
    document.addEventListener(`keydown`, onPopupEscPress);
  };

  window.utils.pinsContainerElement.addEventListener(`click`, (evt) => {
    if (evt.target && evt.target.matches(`.map__pin`) && !evt.target.matches(`.map__pin--main`)) {
      closePopup();
      openPopup(evt.target.dataset.id);
    }
  });

  window.map = {
    appendPins: createPins,
    setStartPinAdress: setMainPinAdress
  };
})();
