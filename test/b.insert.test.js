const {expect} = require('chai'),
	Datastore = require('../lib/Datastore');

describe('Insert', () => {
	let documents = [
		{ name: 'first document' },
		{ name: 'second document' },
		{ name: 'third document' }
	];

	describe(`single`, () => {
		it('should insert single document', () => {
			let db = Datastore.create();
			return db.insert(documents[0])
				.then((inserted) => {
					expect(inserted).to.be.an('object').that.have.all.keys('_id', 'name');
				});
		});
	});

	describe(`bulk`, () => {
		it('should insert multiple documents', () => {
			let db = Datastore.create();
			return db.insert(documents)
				.then((inserted) => {
					expect(inserted).to.be.an('array').that.have.lengthOf(3);
				});
		});
	});
});