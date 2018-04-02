const
	Cursor = require('./Cursor'),
	OriginalDatastore = require('nedb')

/**
 * @class
 */
class Datastore {
	/**
	 * Datastore constructor...
	 *
	 * You should use `Datastore.create(...)` instead
	 * of `new Datastore(...)`. With that you can access
	 * the original datastore's properties such as `datastore.persistance`.
	 *
	 * It's basically the same as the original:
	 * https://github.com/louischatriot/nedb#creatingloading-a-database
	 * 
	 * @param  {Object} [options]
	 * @return {static}
	 */
	constructor(options) {
		Object.defineProperties(this, {
			__loaded: {
				enumerable: false,
				writable: true,
				value: null
			},

			__original: {
				configurable: true,
				enumerable: false,
				writable: false,
				value: new OriginalDatastore(options)
			}
		})
	}

	/**
	 * Load the datastore.
	 * @return {Promise}
	 */
	load() {
		if ( ! (this.__loaded instanceof Promise)) {
			this.__loaded = new Promise((resolve, reject) => {
				this.__original.loadDatabase((error) => {
					return error
						? reject(error)
						: resolve()
				})
			})
		}

		return this.__loaded
	}

	/**
	 * Find documents that match a query.
	 *
	 * It's basically the same as the original:
	 * https://github.com/louischatriot/nedb#finding-documents
	 *
	 * There are differences minor in how the cursor works though.
	 *
	 * @example
	 * datastore.find({ ... }).sort({ ... }).exec().then(...)
	 *
	 * @example
	 * datastore.find({ ... }).sort({ ... }).then(...)
	 *
	 * @example
	 * // in an async function
	 * await datastore.find({ ... }).sort({ ... })
	 * 
	 * @param  {Object} [query]
	 * @param  {Object} [projection]
	 * @return {Cursor}
	 */
	find(query = {}, projection) {
		if (typeof projection === 'function') {
			projection = {}
		}

		return new Cursor(
			this.__original.find(query, projection),
			this.load()
		)
	}

	/**
	 * Find a document that matches a query.
	 *
	 * It's basically the same as the original:
	 * https://github.com/louischatriot/nedb#finding-documents
	 * 
	 * @param  {Object} [query]
	 * @param  {Object} [projection]
	 * @return {Promise.<Object>}
	 */
	findOne(query = {}, projection) {
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

	/**
	 * Insert a document or documents.
	 *
	 * It's basically the same as the original:
	 * https://github.com/louischatriot/nedb#inserting-documents
	 * 
	 * @param  {Object|Object[]} docs
	 * @return {Promise.<Object|Object[]>}
	 */
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

	/**
	 * Update documents that match a query.
	 *
	 * It's basically the same as the original:
	 * https://github.com/louischatriot/nedb#updating-documents
	 *
	 * If you set `options.returnUpdatedDocs`,
	 * the returned promise will resolve with
	 * an object (if `options.multi` is `false`) or
	 * with an array of objects.
	 * 
	 * @param  {Object} query
	 * @param  {Object} update
	 * @param  {Object} [options]
	 * @return {Promise.<number|Object|Object[]>}
	 */
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

	/**
	 * Remove documents that match a query.
	 *
	 * It's basically the same as the original:
	 * https://github.com/louischatriot/nedb#removing-documents
	 * 
	 * @param  {Object} [query]
	 * @param  {Object} [options]
	 * @return {Promise.<number>}
	 */
	remove(query = {}, options = {}) {
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

	/**
	 * Count documents that match a query.
	 *
	 * It's basically the same as the original:
	 * https://github.com/louischatriot/nedb#counting-documents
	 * 
	 * @param  {Object} [query]
	 * @return {Promise.<number>}
	 */
	count(query = {}) {
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

	/**
	 * https://github.com/louischatriot/nedb#indexing
	 * 
	 * @param  {Object} options
	 * @return {Promise}
	 */
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

	/**
	 * https://github.com/louischatriot/nedb#indexing
	 * 
	 * @param  {string} field
	 * @return {Promise}
	 */
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

	/**
	 * Create a database instance.
	 *
	 * Use this over `new Datastore(...)` to access
	 * original nedb datastore properties, such as
	 * `datastore.persistance`.
	 *
	 * For more information visit:
	 * https://github.com/louischatriot/nedb#creatingloading-a-database
	 * 
	 * @param  {string|Object} options
	 * @return {Proxy.<static>}
	 */
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
