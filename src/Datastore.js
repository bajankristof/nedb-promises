const
	Cursor = require('./Cursor'),
	OriginalDatastore = require('nedb')

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
		})
	}

	load() {
		if ( !! this.__loaded) {
			return Promise.resolve()
		}

		return new Promise((resolve, reject) => {
			this.__original.loadDatabase((error) => {
				return error
					? reject(error)
					: resolve()
			})
		})
	}

	find(query, projection) {
		if (typeof projection === 'function') {
			projection = {}
		}

		return new Cursor(
			this.__original.find(query, projection),
			this.load()
		)
	}

	findOne(query, projection) {
		if (typeof projection === 'function') {
			projection = {}
		}

		return this.load().then(() => {
			return new Promise((resolve, reject) => {
				this.__original.findOne(
					query,
					projection,
					(error, result) => {
						return error
							? reject(error)
							: resolve(result)
					}
				)
			})
		})
	}

	insert(docs) {
		return this.load().then(() => {
			return new Promise((resolve, reject) => {
				this.__original.insert(docs, (error, result) => {
					return error
						? reject(error)
						: resolve(result)
				})
			})
		})
	}

	update(query, update, options = {}) {
		return this.load().then(() => {
			return new Promise((resolve, reject) => {
				this.__original.update(
					query,
					update,
					options,
					(error, numAffected, affectedDocuments, upsert) => {
						return error
							? reject(error)
							: (options.returnUpdatedDocs === true)
							? resolve(affectedDocuments)
							: resolve(numAffected)
					}
				)
			})
		})
	}

	remove(query, options = {}) {
		return this.load().then(() => {
			return new Promise((resolve, reject) => {
				this.__original.remove(
					query,
					options,
					(error, result) => {
						return error
							? reject(error)
							: resolve(result)
					}
				)
			})
		})
	}

	count(query) {
		return this.load().then(() => {
			return new Promise((resolve, reject) => {
				this.__original.count(query, (error, result) => {
                    return error
                        ? reject(error)
                        : resolve(result)
				})
			})
		})
	}

	ensureIndex(options) {
		return this.load().then(() => {
			return new Promise((resolve, reject) => {
				this.__original.ensureIndex(options, (error) => {
                    return error
                        ? reject(error)
                        : resolve()
				})
			})
		})
	}

	removeIndex(field) {
		return this.load().then(() => {
			return new Promise((resolve, reject) => {
				this.__original.removeIndex(field, (error) => {
                    return error
                        ? reject(error)
                        : resolve()
				})
			})
		})
	}

	static create(options) {
		return new Proxy(new this(options), {
			get(target, key) {
                return target[key]
                    ? target[key]
                    : target.__original[key]
			},

			set(target, key, value) {
                return target.__original.hasOwnProperty(key)
                    ? (target.__original[key] = value)
                    : (target[key] = value)
			}
		})
	}
}

module.exports = Datastore
