const EventEmitter = require('events');
const OriginalDatastore = require('@seald-io/nedb');
const Cursor = require('./Cursor');

/**
 * @summary
 * As of v2.0.0 the Datastore class extends node's built 
 * in EventEmitter class and implements each method as an event
 * plus additional error events. It also inherits the `compaction.done`
 * event from nedb but for consistency, in this library the event
 * was renamed to `compactionDone`.
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
 * datastore.on('compactionDone', (datastore) => {
 *     // inherited from nedb's compaction.done event
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
     * Create a database instance.
     *
     * Use this over `new Datastore(...)` to access
     * original nedb datastore properties, such as
     * `datastore.persistence`.
     *
     * Note that this method only creates the `Datastore`
     * class instance, not the datastore file itself.
     * The file will only be created once an operation
     * is issued against the datastore or if you call
     * the `load` instance method explicitly.
     * 
     * The path (if specified) will be relative to `process.cwd()`
     * (unless an absolute path was passed).
     *
     * For more information visit:
     * https://github.com/louischatriot/nedb#creatingloading-a-database
     * 
     * @param  {string|Object} [pathOrOptions]
     * @return {Proxy<static>}
     */
    static create(pathOrOptions) {
        return new Proxy(new this(pathOrOptions), {
            get(target, key) {
                return target[key]
                    ? target[key]
                    : target.__original[key];
            },

            set(target, key, value) {
                return Object.prototype.hasOwnProperty.call(target.__original, key)
                    ? (target.__original[key] = value)
                    : (target[key] = value);
            },
        });
    }

    /**
     * Datastore constructor...
     *
     * You should use `Datastore.create(...)` instead
     * of `new Datastore(...)`. With that you can access
     * the original datastore's properties such as `datastore.persistence`.
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
     * @param  {string|Object} [pathOrOptions]
     * @return {static}
     */
    constructor(pathOrOptions) {
        super();

        const datastore = new OriginalDatastore(
            typeof pathOrOptions === 'string'
                ? { filename: pathOrOptions }
                : pathOrOptions,
        );

        Object.defineProperties(this, {
            __loaded: {
                enumerable: false,
                writable: true,
                value: null,
            },

            __original: {
                configurable: true,
                enumerable: false,
                writable: false,
                value: datastore,
            },
        });

        this.__original.on('compaction.done', () => {
            this.emit('compactionDone', this);
        });
    }

    /**
     * Load the datastore.
     *
     * Note that you don't necessarily have to call
     * this method to load the datastore as it will
     * automatically be called and awaited on any
     * operation issued against the datastore
     * (i.e.: `find`, `findOne`, etc.).
     * 
     * @return {Promise<undefined>}
     */
    load() {
        if ( ! (this.__loaded instanceof Promise)) {
            this.__loaded = this.__original.loadDatabaseAsync()
                .then(() => this.broadcastSuccess('load'))
                .catch((error) => { this.broadcastError('load', error); throw error; });
        }

        return this.__loaded;
    }

    /**
     * Find documents that match the specified `query`.
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
            projection = {};
        }

        return new Cursor(this, 'find', query, projection);
    }

    /**
     * Find a document that matches the specified `query`.
     *
     * It's basically the same as the original:
     * https://github.com/louischatriot/nedb#finding-documents
     *
     * @example
     * datastore.findOne({ ... }).then(...)
     *
     * @example
     * // in an async function
     * await datastore.findOne({ ... }).sort({ ... })
     * 
     * @param  {Object} [query]
     * @param  {Object} [projection]
     * @return {Cursor}
     */
    findOne(query = {}, projection) {
        if (typeof projection === 'function') {
            projection = {};
        }

        return new Cursor(this, 'findOne', query, projection);
    }

    /**
     * Insert a document or documents.
     *
     * It's basically the same as the original:
     * https://github.com/louischatriot/nedb#inserting-documents
     * 
     * @param  {Object|Object[]} docs
     * @return {Promise<Object|Object[]>}
     */
    async insert(docs) {
        await this.load();
        try {
            const result = await this.__original.insertAsync(docs);
            this.broadcastSuccess('insert', docs);
            return result;
        } catch (error) {
            this.broadcastError('insert', error, docs);
            throw error;
        }
    }

    /**
     * Insert a single document.
     *
     * This is just an alias for `insert` with object destructuring
     * to ensure a single document.
     * 
     * @param  {Object} doc
     * @return {Promise<Object>}
     */
    insertOne({ ...doc }) {
        return this.insert(doc);
    }

    /**
     * Insert multiple documents.
     *
     * This is just an alias for `insert` with array destructuring
     * to ensure multiple documents.
     * 
     * @param  {Object[]} docs
     * @return {Promise<Object[]>}
     */
    insertMany([...docs]) {
        return this.insert(docs);
    }

    /**
     * Update documents that match the specified `query`.
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
     * @return {Promise<number|Object|Object[]>}
     */
    async update(query, update, options = {}) {
        await this.load();
        try {
            const { numAffected, affectedDocuments } = await this.__original.updateAsync(query, update, options);
            const result = options.returnUpdatedDocs ? affectedDocuments : numAffected;
            this.broadcastSuccess('update', result, query, update, options);
            return result;
        } catch (error) {
            this.broadcastError('update', error, query, update, options);
            throw error;
        }
    }

    /**
     * Update a single document that matches the specified `query`.
     *
     * This is just an alias for `update` with `options.multi` set to `false`.
     * 
     * @param  {Object} query
     * @param  {Object} update
     * @param  {Object} [options]
     * 
     * @return {Promise<number|Object>}
     */
    updateOne(query, update, options = {}) {
        return this.update(query, update, { ...options, multi: false });
    }

    /**
     * Update multiple documents that match the specified `query`.
     *
     * This is just an alias for `update` with `options.multi` set to `true`.
     *
     * @param  {Object} query
     * @param  {Object} update
     * @param  {Object} [options]
     * 
     * @return {Promise<number|Object[]>}
     */
    updateMany(query, update, options = {}) {
        return this.update(query, update, { ...options, multi: true });
    }

    /**
     * Remove documents that match the specified `query`.
     *
     * It's basically the same as the original:
     * https://github.com/louischatriot/nedb#removing-documents
     * 
     * @param  {Object} [query]
     * @param  {Object} [options]
     * @return {Promise<number>}
     */
    async remove(query = {}, options = {}) {
        await this.load();
        try {
            const result = await this.__original.removeAsync(query, options);
            this.broadcastSuccess('remove', result, query, options);
            return result;
        } catch (error) {
            this.broadcastError('remove', error, query, options);
            throw error;
        }
    }

    /**
     * Remove the first document that matches the specified `query`.
     *
     * This is just an alias for `remove` with `options.multi` set to `false`.
     * 
     * @param  {Object} [query]
     * @param  {Object} [options]
     * 
     * @return {Promise<number>}
     */
    removeOne(query, options = {}) {
        return this.remove(query, { ...options, multi: false });
    }

    /**
     * Remove all documents that match the specified `query`.
     *
     * This is just an alias for `remove` with `options.multi` set to `true`.
     * 
     * @param  {Object} [query]
     * @param  {Object} [options]
     * 
     * @return {Promise<number>}
     */
    removeMany(query, options = {}) {
        return this.remove(query, { ...options, multi: true });
    }

    /**
     * Remove the first document that matches the specified `query`.
     *
     * This is just an alias for `removeOne`.
     * 
     * @param  {Object} [query]
     * @param  {Object} [options]
     * 
     * @return {Promise<number>}
     */
    deleteOne(query, options) {
        return this.removeOne(query, options);
    }

    /**
     * Remove all documents that match the specified `query`.
     *
     * This is just an alias for `removeMany`.
     * 
     * @param  {Object} [query]
     * @param  {Object} [options]
     * 
     * @return {Promise<number>}
     */
    deleteMany(query, options) {
        return this.removeMany(query, options);
    }

    /**
     * Count documents matching the specified `query`.
     *
     * It's basically the same as the original:
     * https://github.com/louischatriot/nedb#counting-documents
     *
     * @example
     * datastore.count({ ... }).limit(...).then(...)
     *
     * @example
     * // in an async function
     * await datastore.count({ ... })
     * // or
     * await datastore.count({ ... }).sort(...).limit(...)
     * 
     * @param  {Object} [query]
     * @return {Cursor}
     */
    count(query = {}) {
        return new Cursor(this, 'count', query);
    }

    /**
     * https://github.com/louischatriot/nedb#indexing
     * 
     * @param  {Object} options
     * @return {Promise<undefined>}
     */
    async ensureIndex(options) {
        try {
            const result = await this.__original.ensureIndexAsync(options);
            this.broadcastSuccess('ensureIndex', result, options);
            return result;
        } catch (error) {
            this.broadcastError('ensureIndex', error, options);
            throw error;
        }
    }

    /**
     * https://github.com/louischatriot/nedb#indexing
     * 
     * @param  {string} field
     * @return {Promise<undefined>}
     */
    async removeIndex(field) {
        try {
            const result = await this.__original.removeIndexAsync(field);
            this.broadcastSuccess('removeIndex', result, field);
            return result;
        } catch (error) {
            this.broadcastError('removeIndex', error, field);
            throw error;
        }
    }

    /**
     * Broadcasts operation success messages.
     * 
     * @param  {string} op
     * @param  {*}      result
     * @param  {...*}   args
     * 
     * @return {undefined}
     * @private
     */
    broadcastSuccess(op, result, ...args) {
        this.emit(op, this, result, ...args);
        return this;
    }

    /**
     * Broadcasts operation error messages.
     * 
     * @param  {string} op
     * @param  {Error}  error
     * @param  {...*}   args
     * 
     * @return {undefined}
     * @private
     */
    broadcastError(op, error, ...args) {
        this.emit(`${op}Error`, this, error, ...args);
        this.emit('__error__', this, op, error, ...args);
        return this;
    }
}

module.exports = Datastore;
