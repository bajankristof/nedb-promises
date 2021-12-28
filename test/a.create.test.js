const fs = require('fs');
const path = require('path');
const Datastore = require('../src/Datastore');

const root = path.dirname(__dirname);

describe('testing datastore creation', () => {
    describe('new Datastore(\'foo.db\')', () => {
        it('should create foo.db based on string filename', async () => {
            const datastore = Datastore.create('foo.db');
            await datastore.load();
            expect(fs.existsSync('foo.db')).toBe(true);
            fs.unlinkSync('foo.db');
        });
    });

    describe('new Datastore({ filename: \'bar.db\' })', () => {
        it('sould create bar.db based on object parameters', async () => {
            const datastore = Datastore.create({ filename: 'bar.db' });
            await datastore.load();
            expect(fs.existsSync('bar.db')).toBe(true);
            fs.unlinkSync('bar.db');
        });
    });

    describe('new Datastore()', () => {
        it('should create in memory only database', () => {
            const datastore = Datastore.create();
            expect(datastore.inMemoryOnly).toBe(true);
        });
    });
});
