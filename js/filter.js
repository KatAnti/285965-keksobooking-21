'use strict';

(() => {
  const LOW_PRICE = 10000;
  const HIGHT_PRICE = 50000;
  const LOW_PRICE_LABEL = `low`;
  const HIGH_PRICE_LABEL = `high`;
  const MIDDLE_PRICE_LABEL = `middle`;
  const NO_FILTER_LABEL = `any`;
  const housingTypeInput = document.querySelector(`#housing-type`);
  const housingPriceInput = document.querySelector(`#housing-price`);

  let filters = {
    onSelectChange: () => {}
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
  });

  window.filter = {
    setSelectChangeHandler: (cb) => {
      filters.onSelectChange = cb;
    },
    start: filterAds,
  };
})();
