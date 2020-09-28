'use strict';

const ADS_AMOUNT = 8;
const ADS = [];
const AVATAR_IDS = [`01`, `02`, `03`, `04`, `05`, `06`, `07`, `08`];
const USED_AVATAR_IDS = [];
const PLACE_TYPE = [`palace`, `flat`, `house`, `bungalow`];
const HOURS = [`12:00`, `13:00`, `14:00`];
const FEATURES = [`wifi`, `dishwasher`, `parking`, `washer`, `elevator`, `conditioner`];
const PHOTOS = [`http://o0.github.io/assets/images/tokyo/hotel1.jpg`, `http://o0.github.io/assets/images/tokyo/hotel2.jpg`, `http://o0.github.io/assets/images/tokyo/hotel3.jpg`];
const LOCATION_Y_START = 130;
const LOCATION_Y_END = 630;
const PRICE_MIN = 3000;
const PRICE_MAX = 25000;
const ROOMS_MIN = 1;
const ROOMS_MAX = 10;
const GUESTS_MIN = 1;
const GUESTS_MAX = 10;
const PIN_WIDTH = 50;
const PIN_HEIGHT = 70;

const map = document.querySelector(`.map`);
const mapPinsContainer = document.querySelector(`.map__pins`);
const mapPinsContainerWidth = mapPinsContainer.offsetWidth;
const fragment = document.createDocumentFragment();
const adTemplate = document.querySelector(`#pin`)
  .content
  .querySelector(`.map__pin`);


const getRandomNumber = (min, max) => {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

const getUniqueAvatarId = (idArr, usedIdArr) => {
  const uniqueId = idArr[getRandomNumber(0, idArr.length - 1)];
  if (!usedIdArr.includes(uniqueId)) {
    usedIdArr.push(uniqueId);
    return uniqueId;
  }
  return getUniqueAvatarId(idArr, usedIdArr);
};

const getRandomLengthArrow = (arr) => {
  const start = getRandomNumber(0, arr.length - 1);
  const end = getRandomNumber(0, arr.length - 1);
  if (start !== end) {
    return (start < end) ? arr.slice(start, end) : arr.slice(end, start);
  }

  return getRandomLengthArrow(arr);
};

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
      type: PLACE_TYPE[getRandomNumber(0, PLACE_TYPE.length - 1)],
      rooms: getRandomNumber(ROOMS_MIN, ROOMS_MAX),
      guests: getRandomNumber(GUESTS_MIN, GUESTS_MAX),
      checkin: HOURS[getRandomNumber(0, HOURS.length - 1)],
      checkout: HOURS[getRandomNumber(0, HOURS.length - 1)],
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

const appendAds = (adsArr) => {
  adsArr.forEach((ad) => {
    fragment.append(renderAd(ad));
  }
  );

  mapPinsContainer.append(fragment);
};

for (let i = 0; i < ADS_AMOUNT; i++) {
  ADS.push(createAdData());
}

map.classList.remove(`map--faded`);

appendAds(ADS);
