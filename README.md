# feathers-unsplash

> FeathersJS service adapter for the Unsplash API

## About

This project uses [Feathers](http://feathersjs.com). An open source web framework for building modern real-time applications.

Currently only the `UnsplashPhotos` service class is supported.

It is built on top of the official [unsplash-js](https://github.com/unsplash/unsplash-js#photos) package.

## Install

```
npm install feathers-unsplash node-fetch

yarn add feathers-unsplash node-fetch
```

This adapter requires `fetch` support, which means you'll need to provide it on the global scope.  This means that somewhere in your app you need to use this code:

```
const fetch = require('node-fetch')
global.fetch = fetch
```

## Setup API Access

First you'll need to setup Unsplash API access.

1. Create an app on the [Unsplash API](https://unsplash.com/developers)
2. Copy the `accessKey` into an environment variable.
3. Setup the FeathersJS config

```
// default.json

"unsplash": {
    "accessKey": "MYAPPNAME_UNSPLASH_ACCESS_KEY"
}
```

## Setup a Service

The easiest way to setup a service is to use the [FeathersJS Cli](https://docs.feathersjs.com/guides/basics/services.html#generating-a-service) to generate a "Custom Service".  You can then delete the `service-name.class.js` file that the generator makes and use code like in this example:

```js
// Initializes the `unsplash-photos` service on path `/unsplash-photos`
const { UnsplashPhotos } = require('feathers-unsplash')
const hooks = require('./unsplash-photos.hooks')

const fetch = require('node-fetch')
global.fetch = fetch


module.exports = function (app) {
  const options = {
    accessKey: app.get('unsplash').accessKey
  }

  // Initialize the service with any options it requires
  app.use('/unsplash-photos', new UnsplashPhotos(options, app))

  // Get the initialized service so that we can register hooks
  const service = app.service('unsplash-photos')

  service.hooks(hooks)
}
```

## API

### find

The `find` method supports searching photos by the following query params:

- `keyword`: the search text
- `orientation`: can be either `portrait` or `landscape`. Any other values return an empty list.
- `collections`: an array of collection ids.

It also supports familiar pagination attributes: `$limit` and `$skip`. Note that since the Unsplash API only supports page-level pagination (not record-level skipping like most FeathersJS adapters), you must provide `$skip` as a multiple of the `$limit`.  Here is an example query:

```js
const response = await app.service('unsplash-photos').find({
  query: {
    keyword: 'food',
    orientation: 'portrait',
    $limit: 10, // this is the default limit
    $skip: 10 // Skipping 10 returns the second page of data.
  }
})
```

### get

The `get` method can be used in two ways:

- Pass an image `id` to retrieve data about the image.
- Pass `'random'` to retrieve a random image.

```js
const imageData = await app.service('unsplash-photos').get(id)
const randomImg = await app.service('unsplash-photos').get('random')
```

## Testing & Debugging

Run `npm test` to run all tests in the `test/` directory.

A debug configuration is also included for Visual Studio Code.  This means you can debug with breakpoints by opening the project in VSCode and running the "Mocha Tests" script.

## Help

For more information on all the things you can do with Feathers visit [docs.feathersjs.com](http://docs.feathersjs.com).
