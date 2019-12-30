const unplashPhotos = require('./unsplash-photos/unsplash-photos.service.js')
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(unplashPhotos)
}
