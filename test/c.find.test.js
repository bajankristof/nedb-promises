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
		let datastore = Datastore.create()
		it('should find the first inserted doc', () => {
			return datastore.insert(documents)
				.then((inserted) => {
					return datastore.findOne()
				}).then((result) => {
					expect(result).to.be.an('object').that.has.all.keys('_id', 'name')
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