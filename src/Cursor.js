const OriginalCursor = require('@seald-io/nedb/lib/cursor');

/**
 * @class
 */
class Cursor {
    constructor(datastore, op, ...args) {
        const cursor = datastore.__original[op](...args);
        if (!(cursor instanceof OriginalCursor)) {
            throw new TypeError(`Unexpected ${typeof original}, expected: Cursor (nedb/lib/cursor)`);
        }

        Object.defineProperties(this, {
            __original: {
                configurable: false,
                enumerable: false,
                writable: false,
                value: cursor,
            },

            __datastore: {
                configurable: false,
                enumerable: false,
                writable: false,
                value: datastore,
            },

            __op: {
                configurable: false,
                enumerable: false,
                writable: false,
                value: op,
            },

            __args: {
                configurable: false,
                enumerable: false,
                writable: false,
                value: args,
            },
        });
    }

    /**
     * Sort the queried documents.
     *
     * See: https://github.com/louischatriot/nedb#sorting-and-paginating
     * 
     * @return {Cursor}
     */
    sort(...args) {
        this.__original.sort(...args);
        return this;
    }

    /**
     * Skip some of the queried documents.
     *
     * See: https://github.com/louischatriot/nedb#sorting-and-paginating
     * 
     * @return {Cursor}
     */
    skip(...args) {
        this.__original.skip(...args);
        return this;
    }

    /**
     * Limit the queried documents.
     *
     * See: https://github.com/louischatriot/nedb#sorting-and-paginating
     * 
     * @return {Cursor}
     */
    limit(...args) {
        this.__original.limit(...args);
        return this;
    }

    /**
     * Set the document projection.
     * 
     * See: https://github.com/louischatriot/nedb#projections
     * 
     * @return {Cursor}
     */
    project(...args) {
        this.__original.projection(...args);
        return this;
    }

    /**
     * Execute the cursor.
     *
     * Since the Cursor has a `then` and a `catch` method
     * JavaScript identifies it as a thenable object
     * thus you can await it in async functions.
     *
     * @example
     * // in an async function
     * await datastore.find(...)
     *  .sort(...)
     *  .limit(...)
     *
     * @example
     * // the previous is the same as:
     * await datastore.find(...)
     *  .sort(...)
     *  .limit(...)
     *  .exec()
     * 
     * @return {Promise<Object[]>}
     */
    async exec() {
        await this.__datastore.load();
        try {
            const result = await this.__original.execAsync();
            this.__datastore.broadcastSuccess(this.__op, result, ...this.__args);
            return result;
        } catch (error) {
            this.__datastore.broadcastError(this.__op, error, ...this.__args);
            throw error;
        }
    }

    /**
     * Execute the cursor and set promise callbacks.
     * 
     * For more information visit:
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then
     * 
     * @param  {Function} fulfilled
     * @param  {Function} [rejected]
     * @return {Promise}
     */
    then(fulfilled, rejected) {
        return this.exec().then(fulfilled, rejected);
    }

    /**
     * Execute the cursor and set promise error callback.
     *
     * For more information visit:
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch
     * 
     * @param  {Function} rejected
     * @return {Promise}
     */
    catch(rejected) {
        return this.exec().catch(rejected);
    }
}

module.exports = Cursor;
