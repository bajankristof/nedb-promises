const Datastore = require('../src/Datastore');

describe('testing document insertion', () => {
    const documents = [
        { name: 'first document' },
        { name: 'second document' },
        { name: 'third document' },
    ];

    describe('single', () => {
        it('should insert single document', () => {
            const datastore = Datastore.create();
            return datastore.insert(documents[0])
                .then((inserted) => {
                    expect(inserted).toMatchObject({ name: 'first document' });
                    expect(inserted).toHaveProperty('_id');
                });
        });
    });

    describe('bulk', () => {
        it('should insert multiple documents', () => {
            const datastore = Datastore.create();
            return datastore.insert(documents)
                .then((inserted) => {
                    expect(inserted.length).toBe(3);
                });
        });
    });
});
