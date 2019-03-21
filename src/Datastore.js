const
	Cursor = require('./Cursor'),
	EventEmitter = require('events'),
	OriginalDatastore = require('nedb')

/**
 * @summary
 * As of v2.0.0 the Datastore class extends node's built 
 * in EventEmitter class and implements each method as an event
 * plus additional error events.
 *
 * All event callbacks will be passed the same type of values,
 * the first being the datastore, then the operation result (if there is any)
 * and then the arguments of the called method. (Check out the first example!)
 *
 * All events have a matching error event that goes by the name of `${method}Error`,
 * for example `findError` or `loadError`. The callbacks of these events will receive
 * the same parameters as the normal event handlers except that instead of the 
 * operation result there will be an operation error. (Check out the second example!)
 *
 * A generic `__error__` event is also available. This event will be emitted at any of
 * the above error events. The callbacks of this event will receive the same parameters
 * as the specific error event handlers except that there will be one more parameter 
 * passed between the datastore and the error object, that being the name of the method
 * that failed. (Check out the third example!)
 *
 * @example
 * let datastore = Datastore.create()
 * datastore.on('update', (datastore, result, query, update, options) => {
 * })
 * datastore.on('load', (datastore) => {
 *     // this event doesn't have a result
 * })
 * datastore.on('ensureIndex', (datastore, options) => {
 *     // this event doesn't have a result
 *     // but it has the options argument which will be passed to the
 *     // event handlers
 * })
 *
 * @example
 * let datastore = Datastore.create()
 * datastore.on('updateError', (datastore, error, query, update, options) => {
 * })
 * datastore.on('loadError', (datastore, error) => {
 * })
 * datastore.on('ensureIndexError', (datastore, error, options) => {
 * })
 *
 * @example
 * let datastore = Datastore.create()
 * datastore.on('__error__', (datastore, event, error, ...args) => {
 *     // for example
 *     // datastore, 'find', error, [{ foo: 'bar' }, {}]
 * })
 * 
 * @class
 */
class Datastore extends EventEmitter {
	/**
	 * Datastore constructor...
	 *
	 * You should use `Datastore.create(...)` instead
	 * of `new Datastore(...)`. With that you can access
	 * the original datastore's properties such as `datastore.persistance`.
	 *
	 * Create a Datastore instance.
	 * 
	 * Note that the datastore will be created
	 * relative to `process.cwd()`
	 * (unless an absolute path was passed).
	 * 
	 * It's basically the same as the original:
	 * https://github.com/louischatriot/nedb#creatingloading-a-database
	 * 
	 * @param  {Object} [options]
	 * @return {static}
	 */
	constructor(options) {
		super()

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
	 * @return {Promise.<undefined>}
	 */
	load() {
		if ( ! (this.__loaded instanceof Promise)) {
			this.__loaded = new Promise((resolve, reject) => {
				this.__original.loadDatabase((error) => {
					if (error) {
						this.emit('loadError', this, error)
						this.emit('__error__', this, 'load', error)
						reject(error)
					} else {
						this.emit('load', this)
						resolve()
					}
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
			this.load(),
			(error, result) => {
				if (error) {
					this.emit('findError', this, error, query, projection)
					this.emit('__error__', this, 'find', error, query, projection)
				} else {
					this.emit('find', this, result, query, projection)
				}
			}
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
						if (error) {
							this.emit('findOneError', this, error, query, projection)
							this.emit('__error__', this, 'findOne', error, query, projection)
							reject(error)
						} else {
							this.emit('findOne', this, result, query, projection)
							resolve(result)
						}
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
					if (error) {
						this.emit('insertError', this, error, docs)
						this.emit('__error__', this, 'insert', error, docs)
						reject(error)
					} else {
						this.emit('insert', this, result, docs)
						resolve(result)
					}
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
						if (error) {
							this.emit('updateError', this, error, query, update, options)
							this.emit('__error__', this, 'update', error, query, update, options)
							reject(error)
						} else {
							let result = options.returnUpdatedDocs
								? affectedDocuments
								: numAffected
							this.emit('update', this, result, query, update, options)
							resolve(result)
						}
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
						if (error) {
							this.emit('removeError', this, error, query, options)
							this.emit('__error__', this, 'remove', error, query, options)
							reject(error)
						} else {
							this.emit('remove', this, result, query, options)
							resolve(result)
						}
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
					if (error) {
						this.emit('countError', this, error, query)
						this.emit('__error__', this, 'count', error, query)
						reject(error)
					} else {
						this.emit('count', this, result, query)
						resolve(result)
					}
				})
			})
		})
	}

	/**
	 * https://github.com/louischatriot/nedb#indexing
	 * 
	 * @param  {Object} options
	 * @return {Promise.<undefined>}
	 */
	ensureIndex(options) {
		return new Promise((resolve, reject) => {
			this.__original.ensureIndex(options, (error) => {
				if (error) {
					this.emit('ensureIndexError', this, error, options)
					this.emit('__error__', this, 'ensureIndex', error, options)
					reject(error)
				} else {
					this.emit('ensureIndex', this, options)
					resolve()
				}
			})
		})
	}

	/**
	 * https://github.com/louischatriot/nedb#indexing
	 * 
	 * @param  {string} field
	 * @return {Promise.<undefined>}
	 */
	removeIndex(field) {
		return new Promise((resolve, reject) => {
			this.__original.removeIndex(field, (error) => {
				if (error) {
					this.emit('removeIndexError', this, error, field)
					this.emit('__error__', this, 'removeIndex', error, field)
					reject(error)
				} else {
					this.emit('removeIndex', this, field)
					resolve()
				}
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
	 * Note that the datastore will be created
	 * relative to `process.cwd()`
	 * (unless an absolute path was passed).
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
