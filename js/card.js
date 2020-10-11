'use strict';

(() => {
  const translateType = {
    "palace": `Дворец`,
    "flat": `Квартира`,
    "house": `Дом`,
    "bungalow": `Бунгало`
  };
  const adCardTemplate = document.querySelector(`#card`)
  .content
  .querySelector(`.map__card`);

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

  const hideEmptyProperties = (adData, adElement) => {
    Object.keys(adData).forEach((adSection) => {
      Object.keys(adData[adSection]).forEach((property) => {
        if (!adData[adSection][property] || adData[adSection][property].length === 0 || parseInt(adData[adSection][property], 10) === 0) {
          if (adElement.querySelector(`.popup__${property}`)) {
            adElement.querySelector(`.popup__${property}`).classList.add(`hidden`);
          } else {
            switch (property) {
              case `rooms`:
              case `guests`:
                adElement.querySelector(`.popup__text--capacity`).classList.add(`hidden`);
                break;
              case `checkout`:
              case `checkin`:
                adElement.querySelector(`.popup__text--time`).classList.add(`hidden`);
                break;
            }
          }
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
    hideCardFeatures(adCard.querySelectorAll(`.popup__feature`), adData.offer.features);
    adCard.querySelector(`.popup__description`).textContent = adData.offer.description;
    renderCardPhotos(adData.offer.photos, adCard.querySelector(`.popup__photos`));
    hideEmptyProperties(adData, adCard);
    return adCard;
  };

  window.card = {
    render: renderAdCard
  };
})();
