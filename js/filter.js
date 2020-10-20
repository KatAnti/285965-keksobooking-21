'use strict';

(() => {
  const filter = document.querySelector(`.map__filters`);
  const housingType = document.querySelector(`#housing-type`);
  const housingPrice = document.querySelector(`#housing-price`);


  let filters = {
    onSelectChange: () => {}
  };

  const getPriceCategory = (price) => {
    let category = `middle`;
    if (price < 10000) {
      category = `low`;
    } else if (price > 50000) {
      category = `high`;
    }

    return category;
  };

  const rankItem = (ad) => {
    let rank = 0;

    if (ad.offer.type === housingType.value) {
      rank += 1;
    }

    if (getPriceCategory(ad.offer.price) === housingPrice.value) {
      rank += 1;
    }
    return rank;
  };

  const findCurentRank = () => {
    let currentRank = 0;
    filter.querySelectorAll(`select`).forEach((select) => {
      if (select.value !== `any`) {
        currentRank += 1;
      }
    });
    filter.querySelectorAll(`input`).forEach((input) => {
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
    const adsAmount = suitableAds.length > window.utils.maxAdsAmount ? window.utils.maxAdsAmount : suitableAds.length;
    updatePins(suitableAds, adsAmount);
  };

  filter.addEventListener(`change`, (evt) => {
    if (evt.target && evt.target.matches(`select`)) {
      filters.onSelectChange();
    }
  });

  window.filter = {
    setSelectChangeHandler: (cb) => {
      filters.onSelectChange = cb;
    },
    start: filterAds,
  };
})();
