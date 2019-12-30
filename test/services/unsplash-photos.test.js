const assert = require('assert')
const app = require('../../src/app')
const service = app.service('unsplash-photos')
const defaultExport = require('../../lib/index')

describe('unsplash-photos service', () => {
  it('exposes the UnsplashService', () => {
    const { UnsplashPhotos } = defaultExport

    assert(UnsplashPhotos, 'exposes the UnsplashPhotos class')
  })

  it('registered the service', () => {
    assert.ok(service, 'Registered the service')
  })

  describe('find', () => {
    it('allows search by keyword, includes pagination', async () => {
      const response = await service.find({
        query: {
          keyword: 'food'
        }
      })
      assert(response.data.length === 10)
      assert(response.limit === 10, 'default limit is 10')
      assert(response.skip === 0, 'default skip is 0')
      assert(response.total)
    })

    it('allows specifying orientation: portrait', async () => {
      const response = await service.find({
        query: {
          keyword: 'food',
          orientation: 'portrait'
        }
      })
      assert(response.data.length === 10)
    })

    it('allows specifying orientation: landscape', async () => {
      const response = await service.find({
        query: {
          keyword: 'food',
          orientation: 'landscape'
        }
      })
      assert(response.data.length === 10)
    })

    it('works with $limit', async () => {
      const response = await service.find({
        query: {
          keyword: 'food',
          $limit: 20
        }
      })
      assert(response.data.length === 20)
    })

    it('works with $skip', async () => {
      const response = await service.find({
        query: {
          keyword: 'food'
        }
      })
      const firstRecord = response.data[0]

      const response2 = await service.find({
        query: {
          keyword: 'food',
          $skip: 10
        }
      })
      assert(firstRecord.id !== response2.data[0].id, 'ids are different')
    })

    it('gets next page of photos if $skip >= $limit', async () => {
      const response = await service.find({
        query: {
          $limit: 20,
          keyword: 'food'
        }
      })
      const firstRecord = response.data[0]

      const response2 = await service.find({
        query: {
          keyword: 'food',
          $limit: 20,
          $skip: 20
        }
      })
      assert(firstRecord.id !== response2.data[0].id, 'ids are different')
    })

    it('gets same page of photos if $skip < $limit', async () => {
      const response = await service.find({
        query: {
          $limit: 20,
          keyword: 'food'
        }
      })
      const firstRecord = response.data[0]

      const response2 = await service.find({
        query: {
          keyword: 'food',
          $limit: 20,
          $skip: 19
        }
      })
      assert(firstRecord.id === response2.data[0].id, 'ids are same')
    })

    it('if $skip is less than $limit, returns same page', async () => {
      const response = await service.find({
        query: {
          keyword: 'food'
        }
      })
      const firstRecord = response.data[0]

      const response2 = await service.find({
        query: {
          keyword: 'food',
          $skip: 5
        }
      })
      assert(firstRecord.id === response2.data[0].id, 'ids are the same')
    })
  })

  describe('get', () => {
    it('allows get by id', async () => {
      const response = await service.find({
        query: {
          keyword: 'food'
        }
      })
      const id = response.data[0].id
      const record = await service.get(id)
      assert(record.id === id, 'got record with same id')
    })

    it('allows getting `random` image', async () => {
      const record = await service.get('random')
      assert(record.id, 'got record')
    })
  })
})
