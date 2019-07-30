const
    { expect } = require('chai'),
    Cursor = require('../src/Cursor'),
    Datastore = require('../src/Datastore'),
    Persistence = require('nedb/lib/persistence')

describe('testing datastore proxy', () => {
    let datastore = Datastore.create('test.db')

    it('should not affect promise returns', () => {
        expect(datastore.find({}) instanceof Cursor).to.equal(true)
        expect(datastore.insert({ proxy: true }) instanceof Promise).to.equal(true)
    })

    it('should return original datastore values', () => {
        expect(datastore.persistence instanceof Persistence).to.equal(true)
    })
})