const fs = require('fs'),
	path = require('path'),
	{expect} = require('chai'),
	Datastore = require('../lib/Datastore');

const root = path.dirname(__dirname);

describe(`Create Datastore`, () => {
	describe(`new Datastore('test.db')`, () => {
		it('should create test.db based on string filename', () => {
			let db = Datastore.create('test.db');
			return db.load()
				.then(() => {
					fs.unlinkSync(
						path.join(root, 'test.db'));
				});
		});
	});

	describe(`new Datastore({ filename: 'test.db' })`, () => {
		it('sould create test.db based on object parameters', () => {
			let db = Datastore.create({ filename: 'test.db' });
			return db.load()
				.then(() => {
					fs.unlinkSync(
						path.join(root, 'test.db'));
				}).then();
		});
	});

	describe(`new Datastore()`, () => {
		it('should create in memory only database', (done) => {
			let db = Datastore.create();
			expect(db.__original.inMemoryOnly).to.equal(true);
			done();
		});
	});
});