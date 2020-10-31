/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
(() => {
/*!*************************!*\
  !*** ./js/constants.js ***!
  \*************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


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

})();

(() => {
/*!***********************!*\
  !*** ./js/backend.js ***!
  \***********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const urlGetAds = `https://21.javascript.pages.academy/keksobooking/data`;
const urlSendForm = `https://21.javascript.pages.academy/keksobooking`;

const makeRequest = (onSucсessLoad, onError) => {
  const TIMEOUT = 10000;
  const xhr = new XMLHttpRequest();
  const StatusCode = {
    OK: 200
  };

  xhr.responseType = `json`;

  xhr.addEventListener(`load`, () => {
    if (xhr.status === StatusCode.OK) {
      onSucсessLoad(xhr.response);
    } else {
      onError(`Произошла ошибка! Статус ответа: ` + xhr.status + ` ` + xhr.statusText);
    }
  });

  xhr.addEventListener(`error`, () => {
    onError(`Произошла ошибка соединения`);
  });

  xhr.addEventListener(`timeout`, () => {
    onError(`Запрос не успел выполниться за ` + xhr.timeout + `мc`);
  });

  xhr.timeout = TIMEOUT;

  return xhr;
};

const getAdsFromServer = (onSucсessLoad, onError) => {
  const xhr = makeRequest(onSucсessLoad, onError);
  xhr.open(`GET`, urlGetAds);
  xhr.send();
};

const sendFormData = (data, onSucсessLoad, onError) => {
  const xhr = makeRequest(onSucсessLoad, onError);
  xhr.open(`POST`, urlSendForm);
  xhr.send(data);
};

window.backend = {
  load: getAdsFromServer,
  send: sendFormData
};

})();

(() => {
/*!************************!*\
  !*** ./js/debounce.js ***!
  \************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const DEBOUNCE_INTERVAL = 500;

window.debounce = (cb) => {
  let lastTimeout = null;

  return (...args) => {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(() => {
      cb(...args);
    }, DEBOUNCE_INTERVAL);
  };
};

})();

(() => {
/*!**********************!*\
  !*** ./js/filter.js ***!
  \**********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const LOW_PRICE = 10000;
const HIGHT_PRICE = 50000;
const LOW_PRICE_LABEL = `low`;
const HIGH_PRICE_LABEL = `high`;
const MIDDLE_PRICE_LABEL = `middle`;
const NO_FILTER_LABEL = `any`;
const housingTypeInput = document.querySelector(`#housing-type`);
const housingPriceInput = document.querySelector(`#housing-price`);
const housingRoomsInput = document.querySelector(`#housing-rooms`);
const housingGuestsInput = document.querySelector(`#housing-guests`);
const featuresInputs = document.querySelectorAll(`.map__checkbox`);

let filters = {
  onSelectChange: () => {},
  onInputChange: () => {}
};

const getPriceCategory = (price) => {
  let category;
  switch (true) {
    case (price < LOW_PRICE):
      category = LOW_PRICE_LABEL;
      break;
    case (price > HIGHT_PRICE):
      category = HIGH_PRICE_LABEL;
      break;
    default:
      category = MIDDLE_PRICE_LABEL;
  }
  return category;
};

const rankItem = (ad) => {
  let rank = 0;

  if (ad.offer.type === housingTypeInput.value) {
    rank += 1;
  }

  if (getPriceCategory(ad.offer.price) === housingPriceInput.value) {
    rank += 1;
  }

  if (String(ad.offer.rooms) === housingRoomsInput.value) {
    rank += 1;
  }

  if (String(ad.offer.guests) === housingGuestsInput.value) {
    rank += 1;
  }

  featuresInputs.forEach((feature) => {
    if (feature.checked && ad.offer.features.includes(feature.value)) {
      rank += 1;
    }
  });

  return rank;
};

const findCurentRank = () => {
  let currentRank = 0;
  window.constants.filtersFormElement.querySelectorAll(`select`).forEach((select) => {
    if (select.value !== NO_FILTER_LABEL) {
      currentRank += 1;
    }
  });
  window.constants.filtersFormElement.querySelectorAll(`input`).forEach((input) => {
    if (input.checked) {
      currentRank += 1;
    }
  });
  return currentRank;
};

const updatePins = (adsArr, maxNumber) => {
  window.map.closeCard();
  window.map.createPins(adsArr, maxNumber);
};

const filterAds = (adsArr) => {
  const currentRank = findCurentRank();
  const suitableAds = adsArr.filter((item) => {
    return rankItem(item) === currentRank;
  });
  const adsAmount = suitableAds.length > window.constants.maxAdsAmount ? window.constants.maxAdsAmount : suitableAds.length;
  updatePins(suitableAds, adsAmount);
};

window.constants.filtersFormElement.addEventListener(`change`, (evt) => {
  if (evt.target && evt.target.matches(`select`)) {
    filters.onSelectChange();
  }

  if (evt.target && evt.target.matches(`input`)) {
    filters.onInputChange();
  }
});

window.filter = {
  setSelectChangeHandler: (cb) => {
    filters.onSelectChange = cb;
  },
  setInputChangeHandler: (cb) => {
    filters.onInputChange = cb;
  },
  start: filterAds,
};

})();

(() => {
/*!*******************!*\
  !*** ./js/pin.js ***!
  \*******************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const PIN_WIDTH = 50;
const PIN_HEIGHT = 70;
const pinTemplate = document.querySelector(`#pin`)
.content
.querySelector(`.map__pin`);

const renderPin = (adData) => {
  const ad = pinTemplate.cloneNode(true);
  ad.style.left = (adData.location.x - PIN_WIDTH / 2) + `px`;
  ad.style.top = (adData.location.y - PIN_HEIGHT) + `px`;
  ad.querySelector(`img`).src = adData.author.avatar;
  ad.querySelector(`img`).alt = adData.offer.title;
  ad.querySelector(`img`).style.pointerEvents = `none`;
  ad.dataset.id = adData.index;
  return ad;
};

window.pin = {
  render: renderPin
};

})();

(() => {
/*!********************!*\
  !*** ./js/card.js ***!
  \********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const translateType = {
  "palace": `Дворец`,
  "flat": `Квартира`,
  "house": `Дом`,
  "bungalow": `Бунгало`
};
const adCardTemplate = document.querySelector(`#card`)
.content
.querySelector(`.map__card`);

const renderCardFeatures = (featuresElementsArr, existingFeaturesArr) => {
  featuresElementsArr.forEach((feature) => {
    let isFeatureExist = false;
    existingFeaturesArr.forEach((featureName) => {
      if (feature.className.includes(`--${featureName}`)) {
        isFeatureExist = true;
      }
    });
    if (!isFeatureExist) {
      feature.classList.add(`hidden`);
    }
  });
};

const renderCardPhotos = (photosArr, photosContainer) => {
  photosArr.forEach((photoSrc, index) => {
    const photo = photosContainer.querySelector(`img`);
    if (index === 0) {
      photo.src = photoSrc;
    } else {
      const newPhoto = photo.cloneNode();
      newPhoto.src = photoSrc;
      photosContainer.append(newPhoto);
    }
  });
};

const hideProperty = (property, ad) => {
  let classSuffix = property;
  if (classSuffix === `checkin` || classSuffix === `checkout`) {
    classSuffix = `time`;
  } else if (classSuffix === `rooms` || classSuffix === `guests`) {
    classSuffix = `capacity`;
  }
  const propertyElement = ad.querySelector(`.popup__${classSuffix}`) ? ad.querySelector(`.popup__${classSuffix}`) : ad.querySelector(`.popup__text--${classSuffix}`);
  propertyElement.classList.add(`hidden`);
};

const hideEmptyProperties = (adData, adElement) => {
  Object.keys(adData).forEach((adSection) => {
    Object.keys(adData[adSection]).forEach((property) => {
      if (!adData[adSection][property] || adData[adSection][property].length === 0 || parseInt(adData[adSection][property], 10) === 0) {
        hideProperty(property, adElement);
      }
    });
  });
};

const renderAdCard = (adData) => {
  const adCard = adCardTemplate.cloneNode(true);
  adCard.querySelector(`.popup__avatar`).src = adData.author.avatar;
  adCard.querySelector(`.popup__title`).textContent = adData.offer.title;
  adCard.querySelector(`.popup__text--address`).textContent = adData.offer.address;
  adCard.querySelector(`.popup__text--price`).innerHTML = `${adData.offer.price}&#x20bd;<span>/ночь</span>`;
  adCard.querySelector(`.popup__type`).textContent = translateType[adData.offer.type];
  adCard.querySelector(`.popup__text--capacity`).textContent = `${adData.offer.rooms} комнаты для ${adData.offer.guests} гостей`;
  adCard.querySelector(`.popup__text--time`).textContent = `Заезд после ${adData.offer.checkin}, выезд до ${adData.offer.checkout}`;
  renderCardFeatures(adCard.querySelectorAll(`.popup__feature`), adData.offer.features);
  adCard.querySelector(`.popup__description`).textContent = adData.offer.description;
  renderCardPhotos(adData.offer.photos, adCard.querySelector(`.popup__photos`));
  hideEmptyProperties(adData, adCard);
  return adCard;
};

window.card = {
  render: renderAdCard
};

})();

(() => {
/*!*******************!*\
  !*** ./js/map.js ***!
  \*******************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


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
  setMainPinCoords,
  activateMainPin,
  createPins,
  openCard,
  closeCard
};

})();

(() => {
/*!********************!*\
  !*** ./js/form.js ***!
  \********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const ROOMS_MAX = `100`;
const TITLE_LENGTH_MIN = 30;
const TITLE_LENGTH_MAX = 100;
const BUNGALOW_MIN_PRICE = 0;
const FLAT_MIN_PRICE = 1000;
const HOUSE_MIN_PRICE = 5000;
const PALACE_MIN_PRICE = 10000;
const MAX_PRICE = 1000000;
const HIGH_PRICE_MESSAGE = `Цена не может превышать ${MAX_PRICE}`;
const SHORT_TITLE_MESSAGE = `Описание должно быть не короче ${TITLE_LENGTH_MIN} символов`;
const LONG_TITLE_MESSAGE = `Вы достигли максимальной длины описания в ${TITLE_LENGTH_MAX} символов`;
const StartCoordinates = {
  x: 570,
  y: 375
};
const mainElement = document.querySelector(`main`);
const roomNumberInput = window.constants.adFormElement.querySelector(`#room_number`);
const guestsAmountInput = window.constants.adFormElement.querySelector(`#capacity`);
const priceInput = window.constants.adFormElement.querySelector(`#price`);
const typeInput = window.constants.adFormElement.querySelector(`#type`);
const checkInInput = window.constants.adFormElement.querySelector(`#timein`);
const checkOutInput = window.constants.adFormElement.querySelector(`#timeout`);
const titleInput = window.constants.adFormElement.querySelector(`#title`);
const resetFormButton = window.constants.adFormElement.querySelector(`.ad-form__reset`);
const successMessageTemplate = document.querySelector(`#success`)
  .content
  .querySelector(`.success`);
const errorMessageTemplate = document.querySelector(`#error`)
  .content
  .querySelector(`.error`);

const setFormElementsState = (form, isDisabled) => {
  Array.from(form.children).forEach((element) => {
    element.disabled = isDisabled;
  });
};

const checkRoomsNumberCapacity = () => {
  guestsAmountInput.querySelectorAll(`option`).forEach((option) => {
    const isNotEnoughRooms = roomNumberInput.value < option.value;
    const isHundreedRooms = roomNumberInput.value === ROOMS_MAX;
    const isForGuests = option.value !== `0`;

    option.disabled = false;
    option.selected = true;

    if (isNotEnoughRooms && !isHundreedRooms ||
        isHundreedRooms && isForGuests ||
        !isHundreedRooms && !isForGuests
    ) {
      option.disabled = true;
      option.selected = false;
    }
  });
};

const syncMinPriceAndType = () => {
  switch (typeInput.value) {
    case `bungalow`:
      priceInput.min = BUNGALOW_MIN_PRICE;
      priceInput.placeholder = `${BUNGALOW_MIN_PRICE}`;
      break;
    case `flat`:
      priceInput.min = FLAT_MIN_PRICE;
      priceInput.placeholder = `${FLAT_MIN_PRICE}`;
      break;
    case `house`:
      priceInput.min = HOUSE_MIN_PRICE;
      priceInput.placeholder = `${HOUSE_MIN_PRICE}`;
      break;
    case `palace`:
      priceInput.min = PALACE_MIN_PRICE;
      priceInput.placeholder = `${PALACE_MIN_PRICE}`;
      break;
  }
};

const validatePrice = () => {
  if (parseInt(priceInput.value, 10) > MAX_PRICE) {
    priceInput.setCustomValidity(HIGH_PRICE_MESSAGE);
  } else {
    priceInput.setCustomValidity(``);
  }

  priceInput.reportValidity();
};

const syncTime = (evt) => {
  if (evt.target && evt.target.matches(`#timein`)) {
    checkOutInput.value = evt.target.value;
  } else {
    checkInInput.value = evt.target.value;
  }
};

const validateTitle = () => {
  if (titleInput.value.length < TITLE_LENGTH_MIN) {
    titleInput.setCustomValidity(SHORT_TITLE_MESSAGE);
  } else if (titleInput.value.length === TITLE_LENGTH_MAX) {
    titleInput.setCustomValidity(LONG_TITLE_MESSAGE);
  } else {
    titleInput.setCustomValidity(``);
  }

  titleInput.reportValidity();
};

const disactivatePage = () => {
  window.constants.adFormElement.reset();
  window.constants.filtersFormElement.reset();
  window.constants.mapElement.classList.add(`map--faded`);
  setFormElementsState(window.constants.adFormElement, true);
  window.constants.adFormElement.classList.add(`ad-form--disabled`);
  window.map.closeCard();
  window.map.setMainPinCoords(StartCoordinates.x, StartCoordinates.y);
  window.map.setInputAdress(window.constants.startPinElement.offsetLeft, window.constants.startPinElement.offsetTop, false);

  Array.from(window.constants.pinsContainerElement.children).forEach((element) => {
    if (element.matches(`.map__pin`) && !element.matches(`.map__pin--main`)) {
      element.remove();
    }
  });
};

const onDocumentEscCloseSuccessPopup = (evt) => {
  if (evt.key === window.constants.escape) {
    deleteMessagePopup(document.querySelector(`.success`), onDocumentEscCloseSuccessPopup, onDocumentClickCloseSuccessPopup);
  }
};

const onDocumentClickCloseSuccessPopup = () => {
  deleteMessagePopup(document.querySelector(`.success`), onDocumentEscCloseSuccessPopup, onDocumentClickCloseSuccessPopup);
};

const onDocumentEscCloseErrorPopup = (evt) => {
  if (evt.key === window.constants.escape) {
    deleteMessagePopup(document.querySelector(`.error`), onDocumentEscCloseErrorPopup, onDocumentClickCloseErrorPopup);
  }
};

const onDocumentClickCloseErrorPopup = () => {
  deleteMessagePopup(document.querySelector(`.error`), onDocumentEscCloseErrorPopup, onDocumentClickCloseErrorPopup);
};

const createMessagePopup = (template, onEsc, onClick) => {
  const message = template.cloneNode(true);
  mainElement.appendChild(message);
  document.addEventListener(`keydown`, onEsc);
  document.addEventListener(`click`, onClick);
};

const deleteMessagePopup = (popup, onEsc, onClick) => {
  popup.remove();
  document.removeEventListener(`keydown`, onEsc);
  document.removeEventListener(`click`, onClick);
};

const errorHandler = () => {
  createMessagePopup(errorMessageTemplate, onDocumentEscCloseErrorPopup, onDocumentClickCloseErrorPopup);
};

const successHandler = () => {
  disactivatePage();
  createMessagePopup(successMessageTemplate, onDocumentEscCloseSuccessPopup, onDocumentClickCloseSuccessPopup);
};

const onSubmitHandler = (evt) => {
  evt.preventDefault();

  window.backend.send(new FormData(window.constants.adFormElement), successHandler, errorHandler);
};

const onResetHandler = (evt) => {
  evt.preventDefault();
  disactivatePage();
};

titleInput.addEventListener(`input`, () => {
  validateTitle();
});

priceInput.addEventListener(`input`, () => {
  validatePrice();
});

roomNumberInput.addEventListener(`click`, () => {
  checkRoomsNumberCapacity();
});

typeInput.addEventListener(`click`, () => {
  syncMinPriceAndType();
});

checkInInput.addEventListener(`click`, (evt) => {
  syncTime(evt);
});

checkOutInput.addEventListener(`click`, (evt) => {
  syncTime(evt);
});

window.constants.adFormElement.addEventListener(`submit`, onSubmitHandler);
resetFormButton.addEventListener(`click`, onResetHandler);

window.form = {
  setState: setFormElementsState,
  checkCapacity: checkRoomsNumberCapacity,
  syncMinPrice: syncMinPriceAndType
};

})();

(() => {
/*!********************!*\
  !*** ./js/page.js ***!
  \********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


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

})();

(() => {
/*!********************!*\
  !*** ./js/main.js ***!
  \********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const IS_DISABLED = true;
const IS_PAGE_ACTIVE = true;

window.form.setState(window.constants.adFormElement, IS_DISABLED);
window.form.setState(window.constants.filtersFormElement, IS_DISABLED);
window.map.setInputAdress(window.constants.startPinElement.offsetLeft, window.constants.startPinElement.offsetTop, !IS_PAGE_ACTIVE);
window.form.checkCapacity();
window.form.syncMinPrice();

window.constants.startPinElement.addEventListener(`mousedown`, (evt) => {
  window.page.activate(evt);
  window.map.setInputAdress(window.constants.startPinElement.offsetLeft, window.constants.startPinElement.offsetTop, IS_PAGE_ACTIVE);
  window.map.activateMainPin();
  window.filter.setSelectChangeHandler(window.debounce(() => {
    window.filter.start(window.page.getFilteredAds());
  }));
  window.filter.setInputChangeHandler(window.debounce(() => {
    window.filter.start(window.page.getFilteredAds());
  }));
});

window.constants.startPinElement.addEventListener(`keydown`, (evt) => {
  window.page.activate(evt);
});

})();

(() => {
/*!**********************!*\
  !*** ./js/upload.js ***!
  \**********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */

const FILE_TYPES = [`gif`, `jpg`, `jpeg`, `png`];
const avatarInput = document.querySelector(`.ad-form__field input[type=file]`);
const avatarElement = document.querySelector(`.ad-form-header__preview`);
const housingPhotoInput = document.querySelector(`.ad-form__upload input[type=file]`);
const housingPhotoElement = document.querySelector(`.ad-form__photo`);

const renderImg = (src, container) => {
  const img = document.createElement(`img`);
  img.src = src;
  img.width = `70`;
  img.height = `70`;
  img.alt = `Фотография пользователя`;
  container.append(img);
};

const uploadImg = (input, preview) => {
  const file = input.files[0];
  const fileName = file.name.toLowerCase();

  const matches = FILE_TYPES.some((it) => {
    return fileName.endsWith(it);
  });

  if (matches) {
    const reader = new FileReader();

    reader.addEventListener(`load`, () => {
      if (preview.querySelector(`img`)) {
        preview.querySelector(`img`).src = reader.result;
      } else {
        renderImg(reader.result, preview);
      }
    });

    reader.readAsDataURL(file);
  }
};

avatarInput.addEventListener(`change`, () => {
  uploadImg(avatarInput, avatarElement);
});

housingPhotoInput.addEventListener(`change`, () => {
  uploadImg(housingPhotoInput, housingPhotoElement);
});

})();

/******/ })()
;