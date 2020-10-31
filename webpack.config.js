'use strict';

const path = require(`path`);

module.exports = {
  entry: [
    `./js/constants.js`,
    `./js/backend.js`,
    `./js/debounce.js`,
    `./js/filter.js`,
    `./js/pin.js`,
    `./js/card.js`,
    `./js/map.js`,
    `./js/form.js`,
    `./js/page.js`,
    `./js/main.js`,
    `./js/upload.js`
  ],
  output: {
    filename: `bundle.js`,
    path: path.resolve(__dirname),
    iife: true
  },
  devtool: false
};
