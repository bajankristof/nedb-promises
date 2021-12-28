const Datastore = require('../src/Datastore');

describe('testing document finding', () => {
    const docs = [
        { name: '1st document' },
        { name: '2nd document' },
        { name: '3rd document' },
    ];

    const datastore = Datastore.create();
    beforeEach(async () => await datastore.insert(docs));
    afterEach(async () => await datastore.remove({}, { multi: true }));

    describe('single', () => {
        it('should find the first inserted doc', async () => {
            const foundDoc = await datastore.findOne();
            expect(foundDoc).toHaveProperty('_id');
            expect(foundDoc).toHaveProperty('name');
            expect(foundDoc.name).toMatch(/^(1st|2nd|3rd) document$/);
        });

        it('should find the last inserted doc when sorting backwards', async () => {
            const foundDoc = await datastore.findOne().sort({ name: -1 });
            expect(foundDoc).toHaveProperty('_id');
            expect(foundDoc).toHaveProperty('name');
            expect(foundDoc.name).toBe('3rd document');
        });
    });

    describe('bulk', () => {
        it('should find all inserted docs', async () => {
            const foundDocs = await datastore.find().sort({ name: 1 }).exec();
            expect(foundDocs).toMatchObject(docs);
        });
    });

    describe('find().then()', () => {
        it('should find all inserted docs', async () => {
            const foundDocs = await datastore.find().sort({ name: 1 });
            expect(foundDocs).toMatchObject(docs);
        });
    });
});
