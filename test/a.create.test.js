const fs = require('fs');
const path = require('path');
const Datastore = require('../src/Datastore');

const root = path.dirname(__dirname);

describe('testing datastore creation', () => {
    describe('new Datastore(\'test.db\')', () => {
        it('should create test.db based on string filename', () => {
            const datastore = Datastore.create('test.db');
            return datastore.load()
                .then(() => {
                    fs.unlinkSync(
                        path.join(root, 'test.db'),
                    );
                });
        });
    });

    describe('new Datastore({ filename: \'test.db\' })', () => {
        it('sould create test.db based on object parameters', () => {
            const datastore = Datastore.create({ filename: 'test.db' });
            return datastore.load()
                .then(() => {
                    fs.unlinkSync(
                        path.join(root, 'test.db'),
                    );
                });
        });
    });

    describe('new Datastore()', () => {
        it('should create in memory only database', () => {
            const datastore = Datastore.create();
            expect(datastore.inMemoryOnly).toBe(true);
        });
    });
});
