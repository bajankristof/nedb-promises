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

        let options;
        if(typeof pathOrOptions === 'string'){
            options = {filename:pathOrOptions};
        }else{
            options = pathOrOptions;
        }

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
                value: new OriginalDatastore(options),
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
     * @return {Promise.<undefined>}
     */
    load() {
        if ( ! (this.__loaded instanceof Promise)) {
            this.__loaded = this.__original.loadDatabaseAsync().then(()=>{
                this.emit('load', this);
            }).catch((error)=>{
                this.emit('loadError', this, error);
                this.emit('__error__', this, 'load', error);
                throw error;
            });
        }

        return this.__loaded;
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
            projection = {};
        }

        return new Cursor(
            this.__original.findAsync(query, projection),
            this.load(),
            (error, result) => {
                if (error) {
                    this.emit('findError', this, error, query, projection);
                    this.emit('__error__', this, 'find', error, query, projection);
                } else {
                    this.emit('find', this, result, query, projection);
                }
            },
        );
    }

    /**
     * Find a document that matches a query.
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

        return new Cursor(
            this.__original.findOneAsync(query, projection),
            this.load(),
            (error, result) => {
                if (error) {
                    this.emit('findOneError', this, error, query, projection);
                    this.emit('__error__', this, 'findOne', error, query, projection);
                } else {
                    this.emit('findOne', this, result, query, projection);
                }
            },
        );
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
            return this.__original.insertAsync(docs).then((result)=>{
                this.emit('insert', this, result, docs);
                return result;
            }).catch((error)=>{
                this.emit('insertError', this, error, docs);
                this.emit('__error__', this, 'insert', error, docs);
                throw error;
            });
        });
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
            return this.__original.updateAsync(query,
                update,
                options).then(({numAffected, affectedDocuments})=>{
                let result = options.returnUpdatedDocs
                    ? affectedDocuments
                    : numAffected;
                this.emit('update', this, result, query, update, options);
                return result;
            }).catch((error)=>{
                this.emit('updateError', this, error, query, update, options);
                this.emit('__error__', this, 'update', error, query, update, options);
                throw error; 
            });
        });
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
            return this.__original.removeAsync(query,
                options).then((result)=>{
                this.emit('remove', this, result, query, options);
                return result;
            }).catch((error)=>{
                this.emit('removeError', this, error, query, options);
                this.emit('__error__', this, 'remove', error, query, options);
                throw error;
            });
        });
    }

    /**
     * Count documents that match a query.
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
        return new Cursor(
            this.__original.countAsync(query),
            this.load(),
            (error, result) => {
                if (error) {
                    this.emit('countError', this, error, query);
                    this.emit('__error__', this, 'count', error, query);
                } else {
                    this.emit('count', this, result, query);
                }
            },
        );
    }

    /**
     * https://github.com/louischatriot/nedb#indexing
     * 
     * @param  {Object} options
     * @return {Promise.<undefined>}
     */
    ensureIndex(options) {
        return this.__original.ensureIndexAsync(options).then(()=>{
            this.emit('ensureIndex', this, options);
        }).catch(error=>{
            this.emit('ensureIndexError', this, error, options);
            this.emit('__error__', this, 'ensureIndex', error, options);
            throw error;
        });
    }

    /**
     * https://github.com/louischatriot/nedb#indexing
     * 
     * @param  {string} field
     * @return {Promise.<undefined>}
     */
    removeIndex(field) {
        return this.__original.removeIndexAsync(field).then(()=>{
            this.emit('removeIndex', this, field);
        }).catch((error)=>{
            this.emit('removeIndexError', this, error, field);
            this.emit('__error__', this, 'removeIndex', error, field);
            throw(error);
        });
    }

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
     * @return {Proxy.<static>}
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
}

module.exports = Datastore;
