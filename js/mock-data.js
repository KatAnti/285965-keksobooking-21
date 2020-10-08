'use strict';

(() => {
  const AVATAR_IDS = [`01`, `02`, `03`, `04`, `05`, `06`, `07`, `08`];
  const PLACE_TYPES = [`palace`, `flat`, `house`, `bungalow`];
  const PLACE_TYPES_RU = [`Дворец`, `Квартира`, `Дом`, `Бунгало`];
  const HOURS = [`12:00`, `13:00`, `14:00`];
  const FEATURES = [`wifi`, `dishwasher`, `parking`, `washer`, `elevator`, `conditioner`];
  const GUESTS_AMOUNT = [`для 1 гостя`, `для 2 гостей`, `для 3 гостей`, `не для гостей`];
  const ROOMS_NUMBER = [`1 комната`, `2 комнаты`, `3 комнаты`, `100 комнат`];
  const PHOTOS = [`http://o0.github.io/assets/images/tokyo/hotel1.jpg`, `http://o0.github.io/assets/images/tokyo/hotel2.jpg`, `http://o0.github.io/assets/images/tokyo/hotel3.jpg`];
  const PRICE_MIN = 0;
  const PRICE_MAX = 1000000;

  window.mockData = {
    avatarIds: AVATAR_IDS,
    placeTypes: PLACE_TYPES,
    placeTypesRu: PLACE_TYPES_RU,
    hours: HOURS,
    features: FEATURES,
    guestsAmount: GUESTS_AMOUNT,
    roomsNumber: ROOMS_NUMBER,
    photos: PHOTOS,
    priceMin: PRICE_MIN,
    priceMax: PRICE_MAX
  };
})();


