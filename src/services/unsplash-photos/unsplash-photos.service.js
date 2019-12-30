// Initializes the `unsplash-photos` service on path `/unsplash-photos`
const { UnsplashPhotos } = require('../../../lib/photos.class')
const hooks = require('./unsplash-photos.hooks')

const fetch = require('node-fetch')
global.fetch = fetch


module.exports = function (app) {
  const options = {
    paginate: app.get('paginate'),
    accessKey: app.get('unsplash').accessKey
  }

  // Initialize our service with any options it requires
  app.use('/unsplash-photos', new UnsplashPhotos(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('unsplash-photos')

  service.hooks(hooks)
}
