const
    { expect } = require('chai'),
    Datastore = require('../src/Datastore')

describe('testing document counting', () => {
    let documents = [
        { name: 'first document' },
        { name: 'second document' },
        { name: 'third document' }
    ]

    describe('count', () => {
        let datastore = Datastore.create(),
            insert = datastore.insert(documents)
        it('should get the count of the docs', () => {
            return insert
                .then((inserted) => {
                    return datastore.count()
                }).then((result) => {
                    expect(result).to.be.a('number').that.equals(3)
                })
        })

        it('should get the count of the docs when limiting', () => {
            return insert
                .then((inserted) => {
                    return datastore.count().limit(2)
                }).then((result) => {
                    expect(result).to.be.a('number').that.equals(2)
                })
        })
    })
})
