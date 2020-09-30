'use strict';

const ADS_AMOUNT = 8;
const ads = [];
const AVATAR_IDS = [`01`, `02`, `03`, `04`, `05`, `06`, `07`, `08`];
const USED_AVATAR_IDS = [];
const PLACE_TYPE = [`palace`, `flat`, `house`, `bungalow`];
const PLACE_TYPE_RU = [`Дворец`, `Квартира`, `Дом`, `Бунгало`];
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
const mapFilterContainer = document.querySelector(`.map__filters-container`);
const mapPinsContainerWidth = mapPinsContainer.offsetWidth;
const fragment = document.createDocumentFragment();
const adTemplate = document.querySelector(`#pin`)
  .content
  .querySelector(`.map__pin`);

const adCardTemplate = document.querySelector(`#card`)
  .content
  .querySelector(`.map__card`);


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

const translate = (item, arr, arrRu) => {
  return arrRu[arr.indexOf(item)];
};

const getRandomLengthArrow = (arr) => {
  const start = getRandomNumber(0, arr.length);
  const end = getRandomNumber(0, arr.length);
  if (start !== end) {
    return (start < end) ? arr.slice(start, end) : arr.slice(end, start);
  }

  return getRandomLengthArrow(arr);
};

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


const appendAds = (adsArr) => {
  adsArr.forEach((ad) => {
    fragment.append(renderAd(ad));
  }
  );

  mapPinsContainer.append(fragment);
};

for (let i = 0; i < ADS_AMOUNT; i++) {
  ads.push(createAdData());
}

map.classList.remove(`map--faded`);

appendAds(ads);

mapFilterContainer.before(renderAdCard(ads[0]));
