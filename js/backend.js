'use strict';

const urlGetAds = `https://21.javascript.pages.academy/keksobooking/data`;
const urlSendForm = `https://21.javascript.pages.academy/keksobooking`;

const makeRequest = (onContentLoad, onContentError) => {
  const TIMEOUT = 10000;
  const xhr = new XMLHttpRequest();
  const StatusCode = {
    OK: 200
  };

  xhr.responseType = `json`;

  xhr.addEventListener(`load`, () => {
    if (xhr.status === StatusCode.OK) {
      onContentLoad(xhr.response);
    } else {
      onContentError(`Произошла ошибка! Статус ответа: ` + xhr.status + ` ` + xhr.statusText);
    }
  });

  xhr.addEventListener(`error`, () => {
    onContentError(`Произошла ошибка соединения`);
  });

  xhr.addEventListener(`timeout`, () => {
    onContentError(`Запрос не успел выполниться за ` + xhr.timeout + `мc`);
  });

  xhr.timeout = TIMEOUT;

  return xhr;
};

const getAdsFromServer = (onContentLoad, onContentError) => {
  const xhr = makeRequest(onContentLoad, onContentError);
  xhr.open(`GET`, urlGetAds);
  xhr.send();
};

const sendFormData = (data, onContentLoad, onContentError) => {
  const xhr = makeRequest(onContentLoad, onContentError);
  xhr.open(`POST`, urlSendForm);
  xhr.send(data);
};

window.backend = {
  load: getAdsFromServer,
  send: sendFormData
};
