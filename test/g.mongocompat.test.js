const Datastore = require('../src/Datastore');

describe('testing MongoDB compatibility methods', () => {
    describe('insertOne', () => {
        it('should insert a single document event when passed an array', async () => {
            const datastore = Datastore.create();
            const result = await datastore.insertOne([{ foo: true }, { bar: false }]);
            expect(Array.isArray(result)).toBe(false);
            expect(result['0']).toEqual({ foo: true });
            expect(await datastore.count()).toBe(1);
        });
    });

    describe('insertMany', () => {
        it('should throw when passed a non-iterable value', async () => {
            const datastore = Datastore.create();
            expect(() => datastore.insertMany({})).toThrow();
        });

        it('should insert the specified documents otherwise', async () => {
            const datastore = Datastore.create();
            await datastore.insertMany([{}, {}]);
            expect(await datastore.count()).toBe(2);
        });
    });

    describe('updateOne', () => {
        it('should update a single document', async () => {
            const datastore = Datastore.create();
            await datastore.insert([{}, {}]);
            await datastore.updateOne({}, { $set: { foo: true } }, { multi: true });
            expect(await datastore.count({ foo: true })).toBe(1);
        });
    });

    describe('updateMany', () => {
        it('should update multiple documents', async () => {
            const datastore = Datastore.create();
            await datastore.insert([{}, {}]);
            await datastore.updateMany({}, { $set: { foo: true } }, { multi: false });
            expect(await datastore.count({ foo: true })).toBe(2);
        });
    });

    describe('deleteOne', () => {
        it('should update a single document', async () => {
            const datastore = Datastore.create();
            await datastore.insert([{}, {}]);
            await datastore.deleteOne({}, { multi: true });
            expect(await datastore.count()).toBe(1);
        });
    });

    describe('deleteMany', () => {
        it('should update multiple documents', async () => {
            const datastore = Datastore.create();
            await datastore.insert([{}, {}]);
            await datastore.deleteMany({}, { multi: false });
            expect(await datastore.count()).toBe(0);
        });
    });
});
