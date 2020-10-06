'use strict';

(() => {
  const USED_AVATAR_IDS = [];
  const LOCATION_Y_START = 130;
  const LOCATION_Y_END = 630;
  const mapPinsContainerWidth = window.utils.pinsContainerElement.offsetWidth;

  const getUniqueAvatarId = (idArr, usedIdArr) => {
    const uniqueId = idArr[window.utils.randomNumber(0, idArr.length - 1)];
    if (!usedIdArr.includes(uniqueId)) {
      usedIdArr.push(uniqueId);
      return uniqueId;
    }
    return getUniqueAvatarId(idArr, usedIdArr);
  };

  const createAdData = () => {
    const locationX = window.utils.randomNumber(0, mapPinsContainerWidth);
    const locationY = window.utils.randomNumber(LOCATION_Y_START, LOCATION_Y_END);

    return {
      author: {
        avatar: `img/avatars/user${getUniqueAvatarId(window.mockData.avatarIds, USED_AVATAR_IDS)}.png`
      },
      offer: {
        title: `Заголовок`,
        address: `${locationX}, ${locationY}`,
        price: window.utils.randomNumber(window.mockData.priceMin, window.mockData.priceMax),
        type: window.utils.randomFeature(window.mockData.placeTypes),
        rooms: window.utils.randomFeature(window.mockData.roomsNumber),
        guests: window.utils.randomFeature(window.mockData.guestsAmount),
        checkin: window.utils.randomFeature(window.mockData.hours),
        checkout: window.utils.randomFeature(window.mockData.hours),
        features: window.utils.randomLengthArray(window.mockData.features),
        description: `Описание`,
        photos: window.utils.randomLengthArray(window.mockData.photos)
      },
      location: {
        x: locationX,
        y: locationY
      }
    };
  };

  window.adData = {
    create: createAdData
  };
})();
