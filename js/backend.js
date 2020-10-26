'use strict';

(() => {

  const makeRequest = (method, onSucсessLoad, onError, data) => {
    const TIMEOUT = 10000;
    const url = method === `GET` ? `https://21.javascript.pages.academy/keksobooking/data` : `https://21.javascript.pages.academy/keksobooking`;
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

    xhr.open(method, url);
    if (data) {
      xhr.send(data);
    } else {
      xhr.send();
    }
  };

  const getAdsFromServer = (onSucсessLoad, onError) => {
    makeRequest(`GET`, onSucсessLoad, onError);
  };

  const sendFormData = (data, onSucсessLoad, onError) => {
    makeRequest(`POST`, onSucсessLoad, onError, data);
  };

  window.backend = {
    load: getAdsFromServer,
    send: sendFormData
  };
})();
