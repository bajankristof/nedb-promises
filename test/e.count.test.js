const Datastore = require('../src/Datastore');

describe('testing document counting', () => {
    const docs = [
        { name: '1st document' },
        { name: '2nd document' },
        { name: '3rd document' },
    ];

    const datastore = Datastore.create();
    beforeEach(() => datastore.insert(docs));
    afterEach(() => datastore.remove({}, { multi: true }));

    describe('count', () => {
        it('should get the count of the docs', async () => {
            const count = await datastore.count();
            expect(count).toBe(3);
        });

        it('should get the count of the docs when limiting', async () => {
            const count = await datastore.count().limit(2);
            expect(count).toBe(2);
        });
    });
});
