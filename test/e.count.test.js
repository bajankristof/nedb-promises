const Datastore = require('../src/Datastore');

describe('testing document counting', () => {
    const documents = [
        { name: 'first document' },
        { name: 'second document' },
        { name: 'third document' },
    ];

    describe('count', () => {
        const datastore = Datastore.create();
        const insert = datastore.insert(documents);

        it('should get the count of the docs', () => {
            return insert
                .then(() => {
                    return datastore.count();
                }).then((result) => {
                    expect(result).toBe(3);
                });
        });

        it('should get the count of the docs when limiting', () => {
            return insert
                .then(() => {
                    return datastore.count().limit(2);
                }).then((result) => {
                    expect(result).toBe(2);
                });
        });
    });
});
