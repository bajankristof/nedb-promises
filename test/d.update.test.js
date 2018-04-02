const
    { expect } = require('chai'),
    Datastore = require('../src/Datastore')

describe('testing document update', () => {
    let documents = [
        { name: 'first document' },
        { name: 'second document' },
        { name: 'third document' }
    ]

    describe('single', () => {
        it('should update single document', () => {
            let datastore = Datastore.create()
            return datastore.insert(documents)
                .then((inserted) => {
                    return datastore.update(
                        { name: 'first document' },
                        { name: 'updated document' },
                        { multi: false }
                    )
                })
                .then((numAffected) => {
                    expect(numAffected).to.equal(1)
                })
        })
    })

    describe('single with returnUpdatedDocs', () => {
        it('should update and return single document', () => {
            let datastore = Datastore.create()
            return datastore.insert(documents)
                .then((inserted) => {
                    return datastore.update(
                        { name: 'first document' },
                        { name: 'updated document' },
                        { multi: false, returnUpdatedDocs: true }
                    )
                })
                .then((affectedDocument) => {
                    expect(affectedDocument).to.deep.include({
                        name: 'updated document'
                    })
                })
        })
    })

    describe('bulk', () => {
        it('should update multiple documents', () => {
            let datastore = Datastore.create()
            return datastore.insert(documents)
                .then((inserted) => {
                    return datastore.update(
                        { name: { $regex: /document$/ } },
                        { $set: { test: true } },
                        { multi: true }
                    )
                })
                .then((numAffected) => {
                    expect(numAffected).to.equal(3)
                })
        })
    })

    describe('bulk with returnUpdatedDocs', () => {
        it('should update and return multiple documents', () => {
            let datastore = Datastore.create()
            return datastore.insert(documents)
                .then((inserted) => {
                    return datastore.update(
                        { name: { $regex: /document$/ } },
                        { $set: { test: true } },
                        { multi: true, returnUpdatedDocs: true }
                    )
                })
                .then((affectedDocuments) => {
                    expect(affectedDocuments).to.be.an('array').that.has.lengthOf(3)
                })
        })
    })
})