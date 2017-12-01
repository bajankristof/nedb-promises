const {expect} = require('chai'),
    Cursor = require('../lib/Cursor'),
    Datastore = require('../lib/Datastore'),
    Persistence = require('nedb/lib/persistence'),
    Promise = require('promise');

describe('Proxy', () => {
    let datastore = Datastore.create('test.db');

    it(`should not affect promise returns`, () => {
        expect(datastore.find({}) instanceof Cursor).to.equal(true);
        expect(datastore.insert({ proxy: true }) instanceof Promise).to.equal(true);
    });

    it(`should return original datastore values`, () => {
        expect(datastore.persistence instanceof Persistence).to.equal(true);
    });
});