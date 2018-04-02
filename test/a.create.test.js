const
	fs = require('fs'),
	path = require('path'),
	{ expect } = require('chai'),
	Datastore = require('../src/Datastore')

const root = path.dirname(__dirname)

describe('testing datastore creation', () => {
	describe('new Datastore(\'test.db\')', () => {
		it('should create test.db based on string filename', () => {
			let datastore = Datastore.create('test.db')
			return datastore.load()
				.then(() => {
					fs.unlinkSync(
						path.join(root, 'test.db')
					)
				})
		})
	})

	describe('new Datastore({ filename: \'test.db\' })', () => {
		it('sould create test.db based on object parameters', () => {
			let datastore = Datastore.create({ filename: 'test.db' })
			return datastore.load()
				.then(() => {
					fs.unlinkSync(
						path.join(root, 'test.db')
					)
				})
		})
	})

	describe('new Datastore()', () => {
		it('should create in memory only database', (done) => {
			let datastore = Datastore.create()
			expect(datastore.__original.inMemoryOnly).to.equal(true)
			done()
		})
	})
})