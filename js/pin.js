'use strict';

const PIN_WIDTH = 50;
const PIN_HEIGHT = 70;
const pinTemplate = document.querySelector(`#pin`)
.content
.querySelector(`.map__pin`);

const renderPin = (adData) => {
  const ad = pinTemplate.cloneNode(true);
  ad.style.left = (adData.location.x - PIN_WIDTH / 2) + `px`;
  ad.style.top = (adData.location.y - PIN_HEIGHT) + `px`;
  ad.querySelector(`img`).src = adData.author.avatar;
  ad.querySelector(`img`).alt = adData.offer.title;
  ad.querySelector(`img`).style.pointerEvents = `none`;
  ad.dataset.id = adData.index;
  return ad;
};

window.pin = {
  render: renderPin
};
