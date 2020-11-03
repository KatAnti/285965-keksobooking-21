'use strict';
const FILE_TYPES = [`gif`, `jpg`, `jpeg`, `png`];
const avatarInput = document.querySelector(`.ad-form__field input[type=file]`);
const avatarElement = document.querySelector(`.ad-form-header__preview`);
const housingPhotoInput = document.querySelector(`.ad-form__upload input[type=file]`);
const housingPhotoElement = document.querySelector(`.ad-form__photo`);

const renderImg = (src, container) => {
  const img = document.createElement(`img`);
  img.src = src;
  img.width = `70`;
  img.height = `70`;
  img.alt = `Фотография пользователя`;
  container.append(img);
};

const uploadImg = (input, preview) => {
  const file = input.files[0];
  const fileName = file.name.toLowerCase();

  const matches = FILE_TYPES.some((it) => {
    return fileName.endsWith(it);
  });

  if (matches) {
    const reader = new FileReader();

    reader.addEventListener(`load`, () => {
      if (preview.querySelector(`img`)) {
        preview.querySelector(`img`).src = reader.result;
      } else {
        renderImg(reader.result, preview);
      }
    });

    reader.readAsDataURL(file);
  }
};

avatarInput.addEventListener(`change`, () => {
  uploadImg(avatarInput, avatarElement);
});

housingPhotoInput.addEventListener(`change`, () => {
  uploadImg(housingPhotoInput, housingPhotoElement);
});
