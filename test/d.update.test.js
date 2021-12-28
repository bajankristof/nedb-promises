const Datastore = require('../src/Datastore');

describe('testing document update', () => {
    const docs = [
        { name: '1st document' },
        { name: '2nd document' },
        { name: '3rd document' },
    ];

    const datastore = Datastore.create();
    beforeEach(async () => await datastore.insert(docs));
    afterEach(async () => await datastore.remove({}, { multi: true }));

    describe('single', () => {
        it('should update single document', async () => {
            const { _id } = await datastore.findOne({ name: /^1st/ });
            const numAffected = await datastore.update({ name: /^1st/ }, { test: true }, { multi: false });
            expect(numAffected).toBe(1);
            const affectedDoc = await datastore.findOne({ test: true });
            expect(affectedDoc).toMatchObject({ _id, test: true });
        });
    });

    describe('single with returnUpdatedDocs', () => {
        it('should update and return single document', async () => {
            const { _id } = await datastore.findOne({ name: /^1st/ });
            const affectedDoc = await datastore.update(
                { name: '1st document' },
                { test: true },
                { multi: false, returnUpdatedDocs: true },
            );

            expect(affectedDoc).toMatchObject({ _id, test: true });
        });
    });

    describe('bulk', () => {
        it('should update multiple documents', async () => {
            const numAffected = await datastore.update(
                { name: { $regex: /^1st|2nd/ } },
                { $set: { test: true } },
                { multi: true },
            );

            expect(numAffected).toBe(2);
            const affectedDocs = await datastore.find({ test: true });
            expect(affectedDocs.length).toBe(2);
            affectedDocs.forEach((affectedDoc) => {
                expect(affectedDoc.name.match(/^1st|2nd/)).toBeTruthy();
                expect(affectedDoc.test).toBe(true);
            });
        });
    });

    describe('bulk with returnUpdatedDocs', () => {
        it('should update and return multiple documents', async () => {
            const affectedDocs = await datastore.update(
                { name: { $regex: /^2nd|3rd/ } },
                { $set: { test: true } },
                { multi: true, returnUpdatedDocs: true },
            );

            expect(affectedDocs.length).toBe(2);
            affectedDocs.forEach((affectedDoc) => {
                expect(affectedDoc.name.match(/^2nd|3rd/)).toBeTruthy();
                expect(affectedDoc.test).toBe(true);
            });
        });
    });
});
