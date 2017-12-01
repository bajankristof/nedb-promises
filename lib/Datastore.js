const Promise = require('promise'),
	Cursor = require('./Cursor'),
	OriginalDatastore = require('nedb');

class Datastore {
	constructor(options) {
		Object.defineProperties(this, {
			__loaded: {
				enumerable: false,
				writable: true,
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

	find(query, projection) {
		if (typeof projection === 'function')
			projection = {};
		return new Cursor(this.__original.find(query, projection), this.load());
	}

	findOne(query, projection) {
		if (typeof projection === 'function')
			projection = {};

		return this.load().then(() => {
			return new Promise((resolve, reject) => {
				this.__original.findOne(query, projection, (error, result) => {
					if (error)
						reject(error);
					else resolve(result);
				});
			});
		});
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

	update(query, update, options = {}) {
		return this.load().then(() => {
			return new Promise((resolve, reject) => {
				this.__original.update(query, update, options, (error, numAffected, affectedDocuments, upsert) => {
					if (error)
						reject(error);
					else if (options.upsert === true || options.returnUpdatedDocs === true) {
            resolve([numAffected, affectedDocuments, upsert]);
          }
          else resolve(numAffected);
				});
			});
		});
	}

	remove(query, options = {}) {
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

	static create(options) {
		return new Proxy(new this(options), {
			get(target, key) {
				if (target[key]) {
					return target[key];
				}

				return target.__original[key];
			},

			set(target, key, value) {
				if (target[key]) {
					target[key] = value;
					return true;
				}

				if (target.__original[key]) {
					target.__original[key] = value;
					return true;
				}

				return false;
			}
		});
	}
}

module.exports = Datastore;