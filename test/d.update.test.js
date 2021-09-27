const Datastore = require('../src/Datastore');

describe('testing document update', () => {
    const documents = [
        { name: 'first document' },
        { name: 'second document' },
        { name: 'third document' },
    ];

    describe('single', () => {
        it('should update single document', () => {
            const datastore = Datastore.create();
            return datastore.insert(documents)
                .then(() => {
                    return datastore.update(
                        { name: 'first document' },
                        { name: 'updated document' },
                        { multi: false },
                    );
                })
                .then((numAffected) => {
                    expect(numAffected).toBe(1);
                });
        });
    });

    describe('single with returnUpdatedDocs', () => {
        it('should update and return single document', () => {
            const datastore = Datastore.create();
            return datastore.insert(documents)
                .then(() => {
                    return datastore.update(
                        { name: 'first document' },
                        { name: 'updated document' },
                        { multi: false, returnUpdatedDocs: true },
                    );
                })
                .then((affectedDocument) => {
                    expect(affectedDocument).toMatchObject({ name: 'updated document' });
                    expect(affectedDocument).toHaveProperty('_id');
                });
        });
    });

    describe('bulk', () => {
        it('should update multiple documents', () => {
            const datastore = Datastore.create();
            return datastore.insert(documents)
                .then(() => {
                    return datastore.update(
                        { name: { $regex: /document$/ } },
                        { $set: { test: true } },
                        { multi: true },
                    );
                })
                .then((numAffected) => {
                    expect(numAffected).toBe(3);
                });
        });
    });

    describe('bulk with returnUpdatedDocs', () => {
        it('should update and return multiple documents', () => {
            const datastore = Datastore.create();
            return datastore.insert(documents)
                .then(() => {
                    return datastore.update(
                        { name: { $regex: /document$/ } },
                        { $set: { test: true } },
                        { multi: true, returnUpdatedDocs: true },
                    );
                })
                .then((affectedDocuments) => {
                    expect(affectedDocuments.length).toEqual(3);
                });
        });
    });
});
