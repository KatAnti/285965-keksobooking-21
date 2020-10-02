'use strict';

const ADS_AMOUNT = 8;
const ads = [];
const AVATAR_IDS = [`01`, `02`, `03`, `04`, `05`, `06`, `07`, `08`];
const USED_AVATAR_IDS = [];
const PLACE_TYPE = [`palace`, `flat`, `house`, `bungalow`];
/*
const PLACE_TYPE_RU = [`Дворец`, `Квартира`, `Дом`, `Бунгало`];
*/
const HOURS = [`12:00`, `13:00`, `14:00`];
const FEATURES = [`wifi`, `dishwasher`, `parking`, `washer`, `elevator`, `conditioner`];
const GUESTS_AMOUNT = [`для 1 гостя`, `для 2 гостей`, `для 3 гостей`, `не для гостей`];
const ROOMS_NUMBER = [`1 комната`, `2 комнаты`, `3 комнаты`, `100 комнат`];
const PHOTOS = [`http://o0.github.io/assets/images/tokyo/hotel1.jpg`, `http://o0.github.io/assets/images/tokyo/hotel2.jpg`, `http://o0.github.io/assets/images/tokyo/hotel3.jpg`];
const LOCATION_Y_START = 130;
const LOCATION_Y_END = 630;
const PRICE_MIN = 3000;
const PRICE_MAX = 25000;
const PIN_WIDTH = 50;
const PIN_HEIGHT = 70;
const START_PIN_WIDTH = 65;
const START_PIN_HEIGHT = 87;
const LEFT_BTN = 0;
const ENTER = `Enter`;
const IS_DISABLED = true;
const IS_ACTIVE = true;

const map = document.querySelector(`.map`);
const mapPinsContainer = document.querySelector(`.map__pins`);
/*
const mapFilterContainer = document.querySelector(`.map__filters-container`);
*/
const adForm = document.querySelector(`.ad-form`);
const filtersForm = document.querySelector(`.map__filters`);
const startPin = document.querySelector(`.map__pin--main`);
const adress = document.querySelector(`#address`);
const roomNumberInput = adForm.querySelector(`#room_number`);
const guestsAmountInput = adForm.querySelector(`#capacity`);
const mapPinsContainerWidth = mapPinsContainer.offsetWidth;
const fragment = document.createDocumentFragment();
const adTemplate = document.querySelector(`#pin`)
  .content
  .querySelector(`.map__pin`);

/*
const adCardTemplate = document.querySelector(`#card`)
  .content
  .querySelector(`.map__card`);
*/
const getRandomNumber = (min, max) => {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

const getRandomFeature = (arr) => {
  return arr[getRandomNumber(0, arr.length - 1)];
};

const getUniqueAvatarId = (idArr, usedIdArr) => {
  const uniqueId = idArr[getRandomNumber(0, idArr.length - 1)];
  if (!usedIdArr.includes(uniqueId)) {
    usedIdArr.push(uniqueId);
    return uniqueId;
  }
  return getUniqueAvatarId(idArr, usedIdArr);
};

/*
const translate = (item, arr, arrRu) => {
  return arrRu[arr.indexOf(item)];
};
*/

const getRandomLengthArrow = (arr) => {
  const start = getRandomNumber(0, arr.length);
  const end = getRandomNumber(0, arr.length);
  if (start !== end) {
    return (start < end) ? arr.slice(start, end) : arr.slice(end, start);
  }

  return getRandomLengthArrow(arr);
};

/*
const hideCardFeatures = (featuresElementsArr, existingFeaturesArr) => {
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
*/

/*
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
*/

const createAdData = () => {
  const locationX = getRandomNumber(0, mapPinsContainerWidth);
  const locationY = getRandomNumber(LOCATION_Y_START, LOCATION_Y_END);

  return {
    author: {
      avatar: `img/avatars/user${getUniqueAvatarId(AVATAR_IDS, USED_AVATAR_IDS)}.png`
    },
    offer: {
      title: `Заголовок`,
      address: `${locationX}, ${locationY}`,
      price: getRandomNumber(PRICE_MIN, PRICE_MAX),
      type: getRandomFeature(PLACE_TYPE),
      rooms: getRandomFeature(ROOMS_NUMBER),
      guests: getRandomFeature(GUESTS_AMOUNT),
      checkin: getRandomFeature(HOURS),
      checkout: getRandomFeature(HOURS),
      features: getRandomLengthArrow(FEATURES),
      description: `Описание`,
      photos: getRandomLengthArrow(PHOTOS)
    },
    location: {
      x: locationX,
      y: locationY
    }
  };
};

const renderAd = (adData) => {
  const ad = adTemplate.cloneNode(true);
  ad.style.left = (adData.location.x - PIN_WIDTH / 2) + `px`;
  ad.style.top = (adData.location.y - PIN_HEIGHT) + `px`;
  ad.querySelector(`img`).src = adData.author.avatar;
  ad.querySelector(`img`).alt = adData.offer.title;
  return ad;
};

/*
const renderAdCard = (adData) => {
  const adCard = adCardTemplate.cloneNode(true);
  adCard.querySelector(`.popup__avatar`).src = adData.author.avatar;
  adCard.querySelector(`.popup__title`).textContent = adData.offer.title;
  adCard.querySelector(`.popup__text--address`).textContent = adData.offer.address;
  adCard.querySelector(`.popup__text--price`).innerHTML = `${adData.offer.price}&#x20bd;<span>/ночь</span>`;
  adCard.querySelector(`.popup__type`).textContent = translate(adData.offer.type, PLACE_TYPE, PLACE_TYPE_RU);
  adCard.querySelector(`.popup__text--capacity`).textContent = `${adData.offer.rooms} комнаты для ${adData.offer.guests} гостей`;
  adCard.querySelector(`.popup__text--time`).textContent = `Заезд после ${adData.offer.checkin}, выезд до ${adData.offer.checkout}`;
  hideCardFeatures(adCard.querySelectorAll(`.popup__feature`), adData.offer.features);
  adCard.querySelector(`.popup__description`).textContent = adData.offer.description;
  renderCardPhotos(adData.offer.photos, adCard.querySelector(`.popup__photos`));

  return adCard;
};
*/


const appendAds = (adsArr) => {
  adsArr.forEach((ad) => {
    fragment.append(renderAd(ad));
  }
  );

  mapPinsContainer.append(fragment);
};

const setFormElementsState = (form, isDisabled) => {
  Array.from(form.children).forEach((element) => {
    element.disabled = isDisabled;
  });
};

const activatePage = (evt) => {
  if (map.classList.contains(`map--faded`) && (evt.button === LEFT_BTN || evt.key === ENTER)) {
    map.classList.remove(`map--faded`);
    adForm.classList.remove(`ad-form--disabled`);
    appendAds(ads);
    setFormElementsState(adForm, false);
    setFormElementsState(filtersForm, false);
  }
};

const setMainPinAdress = (isPageActive) => {
  let x = parseInt(startPin.style.left, 10);
  let y = parseInt(startPin.style.top, 10);
  if (isPageActive) {
    x = x - START_PIN_WIDTH / 2;
    y = y - START_PIN_HEIGHT;
  }
  adress.value = `${x}, ${y}`;
};

const checkRoomsNumberCapacity = () => {
  guestsAmountInput.querySelectorAll(`option`).forEach((option) => {
    const isNotEnoughRooms = roomNumberInput.value < option.value;
    const isHundreedRooms = roomNumberInput.value === `100`;
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

for (let i = 0; i < ADS_AMOUNT; i++) {
  ads.push(createAdData());
}

/*
mapFilterContainer.before(renderAdCard(ads[0]));
*/

setFormElementsState(adForm, IS_DISABLED);
setFormElementsState(filtersForm, IS_DISABLED);
setMainPinAdress(!IS_ACTIVE);
checkRoomsNumberCapacity();

startPin.addEventListener(`mousedown`, (evt) => {
  activatePage(evt);
  setMainPinAdress(IS_ACTIVE);
});

startPin.addEventListener(`keydown`, (evt) => {
  activatePage(evt);
});

roomNumberInput.addEventListener(`click`, () => {
  checkRoomsNumberCapacity();
});
