const Datastore = require('../src/Datastore');

describe('testing document finding', () => {
    const documents = [
        { name: 'first document' },
        { name: 'second document' },
        { name: 'third document' },
    ];

    describe('single', () => {
        const datastore = Datastore.create();
        const insert = datastore.insert(documents);

        it('should find the first inserted doc', () => {
            return insert
                .then(() => {
                    return datastore.findOne();
                }).then((result) => {
                    expect(result).toHaveProperty('_id');
                    expect(result).toHaveProperty('name');
                    expect(result.name).toMatch(/^(first|second|third) document$/);
                });
        });

        it('should find the last inserted doc when sorting backwards', () => {
            return insert
                .then(() => {
                    return datastore.findOne().sort({ name: -1 });
                }).then((result) => {
                    expect(result).toHaveProperty('_id');
                    expect(result).toHaveProperty('name');
                    expect(result.name).toBe('third document');
                });
        });
    });

    describe('bulk', () => {
        const datastore = Datastore.create();
        it('should find all inserted docs', () => {
            return datastore.insert(documents)
                .then(() => {
                    return datastore.find().exec();
                }).then((result) => {
                    expect(result.length).toBe(3);
                });
        });
    });

    describe('find().then()', () => {
        let datastore = Datastore.create();
        it('should find all inserted docs', () => {
            return datastore.insert(documents)
                .then(() => {
                    return datastore.find().then((result) => {
                        expect(result.length).toBe(3);
                    });
                });
        });
    });
});
