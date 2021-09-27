const Cursor = require('../src/Cursor');
const Datastore = require('../src/Datastore');
const Persistence = require('@seald-io/nedb/lib/persistence');

describe('testing datastore proxy', () => {
    let datastore = Datastore.create('test.db');

    it('should not affect promise returns', () => {
        expect(datastore.find({}) instanceof Cursor).toBe(true);
        expect(datastore.insert({ proxy: true }) instanceof Promise).toBe(true);
    });

    it('should return original datastore values', () => {
        expect(datastore.persistence instanceof Persistence).toBe(true);
    });
});
