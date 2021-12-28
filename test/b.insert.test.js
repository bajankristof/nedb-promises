const Datastore = require('../src/Datastore');

describe('testing document insertion', () => {
    const docs = [
        { name: '1st document' },
        { name: '2nd document' },
        { name: '3rd document' },
    ];

    describe('single', () => {
        it('should insert single document', async () => {
            const datastore = Datastore.create();
            const insertedDoc = await datastore.insert(docs[0]);
            expect(insertedDoc).toMatchObject({ name: '1st document' });
            expect(insertedDoc).toHaveProperty('_id');
        });
    });

    describe('bulk', () => {
        it('should insert multiple documents', async () => {
            const datastore = Datastore.create();
            const insertedDocs = await datastore.insert(docs);
            expect(insertedDocs.length).toBe(3);
            expect(insertedDocs).toMatchObject(docs);
        });
    });
});
