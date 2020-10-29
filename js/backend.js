'use strict';

(() => {
  const urlGetAds = `https://21.javascript.pages.academy/keksobooking/data`;
  const urlSendForm = `https://21.javascript.pages.academy/keksobooking`;

  const makeRequest = (onSucсessLoad, onError) => {
    const TIMEOUT = 10000;
    const xhr = new XMLHttpRequest();
    const StatusCode = {
      OK: 200
    };

    xhr.responseType = `json`;

    xhr.addEventListener(`load`, () => {
      if (xhr.status === StatusCode.OK) {
        onSucсessLoad(xhr.response);
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

    return xhr;
  };

  const getAdsFromServer = (onSucсessLoad, onError) => {
    const xhr = makeRequest(onSucсessLoad, onError);
    xhr.open(`GET`, urlGetAds);
    xhr.send();
  };

  const sendFormData = (data, onSucсessLoad, onError) => {
    const xhr = makeRequest(onSucсessLoad, onError);
    xhr.open(`POST`, urlSendForm);
    xhr.send(data);
  };

  window.backend = {
    load: getAdsFromServer,
    send: sendFormData
  };
})();
