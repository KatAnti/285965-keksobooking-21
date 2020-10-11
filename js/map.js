'use strict';

(() => {
  const ESCAPE = `Escape`;
  const START_PIN_WIDTH = 65;
  const START_PIN_HEIGHT = 87;
  const adress = document.querySelector(`#address`);
  const mapFilterContainer = document.querySelector(`.map__filters-container`);

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

  const openPopup = (ads, currentId) => {
    mapFilterContainer.before(window.card.render(ads[currentId]));
    const closePopupBtn = window.utils.mapElement.querySelector(`.popup`)
      .querySelector(`.popup__close`);

    closePopupBtn.addEventListener(`click`, onPopupCloseClick);
    document.addEventListener(`keydown`, onPopupEscPress);
  };

  const appendPinsOnSucessLoad = (ads) => {
    const fragment = document.createDocumentFragment();
    ads.forEach((ad, i) => {
      if (ad.offer) {
        fragment.append(window.pin.render(ad, i));
      }
    });

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

  window.map = {
    sucsessHandler: appendPinsOnSucessLoad,
    errorHandler: showErrorMessage,
    setStartPinAdress: setMainPinAdress
  };
})();
