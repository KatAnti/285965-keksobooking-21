'use strict';

(() => {

  const getAdsFromServer = (onSucsessLoad, onError) => {
    const URL = `https://21.javascript.pages.academy/keksobooking/data`;
    const TIMEOUT = 10000;
    const xhr = new XMLHttpRequest();
    const StatusCode = {
      OK: 200
    };

    xhr.responseType = `json`;

    xhr.addEventListener(`load`, () => {
      if (xhr.status === StatusCode.OK) {
        onSucsessLoad(xhr.response);
      } else {
        onError(`Произошла ошибка! Статус ответа: ` + xhr.status + ` ` + xhr.statusText);
      }
    });

    xhr.addEventListener(`error`, () => {
      onError(`Произошла ошибка соединения`);
    });

    xhr.addEventListener(`timeout`, () => {
      onError(`Запрос не успел выполниться за ` + xhr.timeout + `мc`);
    });

    xhr.timeout = TIMEOUT;

    xhr.open(`GET`, URL);
    xhr.send();
  };

  window.backend = {
    load: getAdsFromServer,
  };
})();
