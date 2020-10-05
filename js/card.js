'use strict';

(() => {
  const adCardTemplate = document.querySelector(`#card`)
  .content
  .querySelector(`.map__card`);

  const translate = (item, arr, arrRu) => {
    return arrRu[arr.indexOf(item)];
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

  const renderAdCard = (adData) => {
    const adCard = adCardTemplate.cloneNode(true);
    adCard.querySelector(`.popup__avatar`).src = adData.author.avatar;
    adCard.querySelector(`.popup__title`).textContent = adData.offer.title;
    adCard.querySelector(`.popup__text--address`).textContent = adData.offer.address;
    adCard.querySelector(`.popup__text--price`).innerHTML = `${adData.offer.price}&#x20bd;<span>/ночь</span>`;
    adCard.querySelector(`.popup__type`).textContent = translate(adData.offer.type, window.mockData.placeTypes, window.mockData.placeTypesRu);
    adCard.querySelector(`.popup__text--capacity`).textContent = `${adData.offer.rooms} комнаты для ${adData.offer.guests} гостей`;
    adCard.querySelector(`.popup__text--time`).textContent = `Заезд после ${adData.offer.checkin}, выезд до ${adData.offer.checkout}`;
    hideCardFeatures(adCard.querySelectorAll(`.popup__feature`), adData.offer.features);
    adCard.querySelector(`.popup__description`).textContent = adData.offer.description;
    renderCardPhotos(adData.offer.photos, adCard.querySelector(`.popup__photos`));

    return adCard;
  };

  window.card = {
    render: renderAdCard
  };
})();
