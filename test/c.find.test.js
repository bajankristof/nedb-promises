const
    { expect } = require('chai'),
    Datastore = require('../src/Datastore')

describe('testing document finding', () => {
    let documents = [
        { name: 'first document' },
        { name: 'second document' },
        { name: 'third document' }
    ]

    describe('single', () => {
        let datastore = Datastore.create(),
            insert = datastore.insert(documents)
        it('should find the first inserted doc', () => {
            return insert
                .then((inserted) => {
                    return datastore.findOne()
                }).then((result) => {
                    expect(result).to.be.an('object').that.has.all.keys('_id', 'name')
                })
        })

        it('should find the last inserted doc when sorting backwards', () => {
            return insert
                .then((inserted) => {
                    return datastore.findOne().sort({ name: -1 })
                }).then((result) => {
                    expect(result).to.be.an('object').that.has.all.keys('_id', 'name')
                    expect(result.name).to.equal('third document')
                })
        })
    })

    describe('bulk', () => {
        let datastore = Datastore.create()
        it('should find all inserted docs', () => {
            return datastore.insert(documents)
                .then(() => {
                    return datastore.find().exec()
                }).then((result) => {
                    expect(result).to.be.an('array').that.has.lengthOf(3)
                })
        })
    })

    describe('find().then()', () => {
        let datastore = Datastore.create()
        it('should find all inserted docs', () => {
            return datastore.insert(documents)
                .then(() => {
                    return datastore.find().then((result) => {
                        expect(result).to.be.an('array').that.has.lengthOf(3)
                    })
                })
        })
    })
})
