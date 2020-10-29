'use strict';

(() => {
  const getRandomNumber = (min, max) => {
    return Math.floor(min + Math.random() * (max + 1 - min));
  };

  const getRandomFeature = (arr) => {
    return arr[getRandomNumber(0, arr.length - 1)];
  };

  const getRandomLengthArray = (arr) => {
    const start = getRandomNumber(0, arr.length);
    const end = getRandomNumber(0, arr.length);
    if (start !== end) {
      return (start < end) ? arr.slice(start, end) : arr.slice(end, start);
    }

    return getRandomLengthArray(arr);
  };

  window.utils = {
    randomNumber: getRandomNumber,
    randomFeature: getRandomFeature,
    randomLengthArray: getRandomLengthArray
  };
})();
