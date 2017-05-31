const Promise = require('promise'),
	Cursor = require('./Cursor'),
	OriginalDatastore = require('nedb');

class Datastore {
	constructor(options) {
		Object.defineProperties(this, {
			__loaded: {
				enumerable: false,
				value: false
			},

			__original: {
				configurable: true,
				enumerable: false,
				writable: false,
				value: new OriginalDatastore(options)
			}
		});
	}

	load() {
		if (!!this.__loaded)
			return Promise.resolve();
		return new Promise((resolve, reject) => {
			this.__original.loadDatabase((error) => {
				if (error)
					reject(error);
				this.__loaded = true;
				resolve();
			});
		});
	}

	find(query, selection) {
		if (typeof selection === 'function')
			selection = null;
		return new Cursor(this.__original.find(query, selection), this.load());
	}

	insert(docs) {
		return this.load().then(() => {
			return new Promise((resolve, reject) => {
				this.__original.insert(docs, (error, result) => {
					if (error)
						reject(error);
					else resolve(result);
				});
			});
		});
	}

	update(query, update, options) {
		return this.load().then(() => {
			return new Promise((resolve, reject) => {
				this.__original.update(query, update, options, (error, result) => {
					if (error)
						reject(error);
					else resolve(result);
				});
			});
		});
	}

	remove(query, options) {
		return this.load().then(() => {
			return new Promise((resolve, reject) => {
				this.__original.remove(query, options, (error, result) => {
					if (error)
						reject(error);
					else resolve(result);
				});
			});
		});
	}

	count(query) {
		return this.load().then(() => {
			return new Promise((resolve, reject) => {
				this.__original.count(query, (error, result) => {
					if (error)
						reject(error);
					else resolve(result);
				});
			});
		});
	}

	ensureIndex(options) {
		return this.load().then(() => {
			return new Promise((resolve, reject) => {
				this.__original.ensureIndex(options, (error) => {
					if (error)
						reject(error);
					else resolve();
				});
			});
		});
	}

	removeIndex(field) {
		return this.load().then(() => {
			return new Promise((resolve, reject) => {
				this.__original.removeIndex(field, (error) => {
					if (error)
						reject(error);
					else resolve();
				});
			});
		});
	}
}