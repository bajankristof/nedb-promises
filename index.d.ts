import { EventEmitter } from 'events';

declare namespace NeDB {
  type Query = {
    [key: string]: any;
  }

  type Update = {
    [key: string]: any;
  }

  type Projection<TSchema> = {
    [p in keyof TSchema]?: number;
  }

  interface Persistence {
    /**
     * Under the hood, NeDB's persistence uses an append-only format, meaning
     * that all updates and deletes actually result in lines added at the end
     * of the datafile, for performance reasons. The database is automatically
     * compacted (i.e. put back in the one-line-per-document format) every
     * time you load each database within your application.
     *
     * You can manually call the compaction function with
     * `datastore.persistence.compactDatafile` which takes no argument. It
     * queues a compaction of the datafile in the executor, to be executed
     * sequentially after all pending operations. The datastore will fire a
     * compaction.done event once compaction is finished.
     */
    compactDatafile(): void;

    /**
     * Set automatic compaction at a regular `interval` in milliseconds (a
     * minimum of 5s is enforced).
     */
    setAutocompactionInterval(interval: number): void;

    /**
     * Stop automatic compaction with
     * `datastore.persistence.stopAutocompaction()`.
     */
    stopAutocompaction(): void;
  }

  interface AbstractCursor<TSchema> {
    /**
     * Sort the queried documents.
     *
     * See: https://github.com/louischatriot/nedb#sorting-and-paginating
     */
    sort(query: any): this;

    /**
     * Skip some of the queried documents.
     *
     * See: https://github.com/louischatriot/nedb#sorting-and-paginating
     */
    skip(n: number): this;

    /**
     * Limit the queried documents.
     *
     * See: https://github.com/louischatriot/nedb#sorting-and-paginating
     */
    limit(n: number): this;

    /**
     * Set the document projection.
     * 
     * See: https://github.com/louischatriot/nedb#projections
     */
    project(projection: Projection<TSchema>): this;
  }

  interface FindCursor<TSchema> extends AbstractCursor<TSchema>, Promise<TSchema[]> {
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
     */
    exec(): Promise<TSchema[]>;
  }

  interface FindOneCursor<TSchema> extends AbstractCursor<TSchema>, Promise<TSchema | null> {
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
     */
    exec(): Promise<TSchema | null>;
  }

  type DatastoreOptions = {
    /**
     * Path to the file where the data is persisted. If left blank, the
     * datastore is automatically considered in-memory only. It cannot end
     * with a `~` which is used in the temporary files NeDB uses to perform
     * crash-safe writes.
     */
     filename?: string;

     /**
      * As the name implies...
      * 
      * Defaults to `false`.
      */
     inMemoryOnly?: boolean;
 
     /**
      * Timestamp the insertion and last update of all documents, with the
      * fields createdAt and updatedAt. User-specified values override
      * automatic generation, usually useful for testing.
      *
      * Defaults to `false`.
      */
     timestampData?: boolean;
 
     /**
      * If used, the database will automatically be loaded from the datafile
      * upon creation (you don't need to call `load`). Any command issued
      * before load is finished is buffered and will be executed when load is
      * done.
      *
      * Defaults to `false`.
      */
     autoload?: boolean;
 
     /**
      * If you use autoloading, this is the handler called after `load`. It
      * takes one error argument. If you use autoloading without specifying
      * this handler, and an error happens during load, an error will be
      * thrown.
      */
     onload?(error: Error): any;
 
     /**
      * Hook you can use to transform data after it was serialized and before
      * it is written to disk. Can be used for example to encrypt data before
      * writing database to disk. This function takes a string as parameter
      * (one line of an NeDB data file) and outputs the transformed string,
      * which must absolutely not contain a `\n` character (or data will be
      * lost).
      */
     afterSerialization?(line: string): string;
 
     /**
      * Inverse of afterSerialization. Make sure to include both and not just
      * one or you risk data loss. For the same reason, make sure both
      * functions are inverses of one another.
      *
      * Some failsafe mechanisms are in place to prevent data loss if you
      * misuse the serialization hooks: NeDB checks that never one is declared
      * without the other, and checks that they are reverse of one another by
      * testing on random strings of various lengths. In addition, if too much
      * data is detected as corrupt, NeDB will refuse to start as it could mean
      * you're not using the deserialization hook corresponding to the
      * serialization hook used before.
      */
     beforeDeserialization?(line: string): string;
 
     /**
      * Between 0 and 1, defaults to 10%. NeDB will refuse to start if more
      * than this percentage of the datafile is corrupt. 0 means you don't
      * tolerate any corruption, 1 means you don't care.
      */
     corruptAlertThreshold?: number;
 
     /**
      * Compares strings `a` and `b` and returns -1, 0 or 1. If specified, it
      * overrides default string comparison which is not well adapted to non-US
      * characters in particular accented letters. Native `localCompare` will
      * most of the time be the right choice.
      */
     compareStrings?(a: string, b: string): number;
 
     /**
      * If you are using NeDB from whithin a Node Webkit app, specify its name
      * (the same one you use in the package.json) in this field and the
      * filename will be relative to the directory Node Webkit uses to store
      * the rest of the application's data (local storage etc.). It works on
      * Linux, OS X and Windows. Now that you can use
      * `require('nw.gui').App.dataPath` in Node Webkit to get the path to the
      * data directory for your application, you should not use this option
      * anymore and it will be removed.
      * @deprecated
      */
     nodeWebkitAppName?: string;
  }

  type UpdateOptions = {
    /**
     * Allows the modification of several documents if set to `true`.
     * 
     * Defaults to `false`.
     */
    multi?: boolean;

    /**
     * If you want to insert a new document corresponding to the `update` rules
     * if your `query` doesn't match anything. If your `update` is a simple object
     * with no modifiers, it is the inserted document. In the other case, the
     * `query` is stripped from all operator recursively, and the `update` is
     * applied to it.
     * 
     * Defaults to `false`.
     */
    upsert?: boolean;

    /**
     * (Not MongoDB-compatible) If set to true and update is not an upsert,
     * will return the document or the array of documents (when multi is set
     * to `true`) matched by the find query and updated. Updated documents
     * will be returned even if the update did not actually modify them.
     *
     * Defaults to `false`.
     */
    returnUpdatedDocs?: boolean;
  }

  type RemoveOptions = {
    /**
     * Allows the removal of multiple documents if set to true.
     *
     * Defaults to `false`.
     */
    multi?: boolean;
  }

  type IndexOptions = {
    /**
     * The name of the field to index. Use the dot notation to index a field
     * in a nested document.
     */
    fieldName: string;

    /**
     * Enforce field uniqueness. Note that a unique index will raise an error
     * if you try to index two documents for which the field is not defined.
     */
    unique?: boolean;

    /**
     * Don't index documents for which the field is not defined. Use this
     * option along with `unique` if you want to accept multiple documents for
     * which it is not defined.
     */
    sparse?: boolean;

    /**
     * If set, the created index is a TTL (time to live) index, that will
     * automatically remove documents when the system date becomes larger than
     * the date on the indexed field plus `expireAfterSeconds`. Documents where
     * the indexed field is not specified or not a Date object are ignored.
     */
    expireAfterSeconds?: number;
  }

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
  class Datastore<TDocument> extends EventEmitter {
    persistence: Persistence;

    private constructor();

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
     */
    static create(
      pathOrOptions: DatastoreOptions & { timestampData: true },
    ): Datastore<{ _id: string, createdAt: Date, updatedAt: Date }>;
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
     */
    static create(
      pathOrOptions?: string | DatastoreOptions,
    ): Datastore<{ _id: string }>;

    /**
     * Load the datastore.
     *
     * Note that you don't necessarily have to call
     * this method to load the datastore as it will
     * automatically be called and awaited on any
     * operation issued against the datastore
     * (i.e.: `find`, `findOne`, etc.).
     */
    load(): Promise<void>;

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
     */
    find<TSchema>(
      query: Query,
      projection?: Projection<TDocument & TSchema>,
    ): FindCursor<TDocument & TSchema>;

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
     */
    findOne<TSchema>(
      query: Query,
      projection?: Projection<TDocument & TSchema>,
    ): FindOneCursor<TDocument & TSchema>;

    /**
     * Insert a document.
     *
     * It's basically the same as the original:
     * https://github.com/louischatriot/nedb#inserting-documents
     */
    insert<TSchema>(
      docs: TSchema,
    ): Promise<TDocument & TSchema>;
    /**
     * Insert an array of documents.
     *
     * It's basically the same as the original:
     * https://github.com/louischatriot/nedb#inserting-documents
     */
    insert<TSchema>(
      docs: TSchema[],
    ): Promise<(TDocument & TSchema)[]>;

    /**
     * Insert a single document.
     *
     * This is just an alias for `insert` with object destructuring
     * to ensure a single document.
     */
    insertOne<TSchema>(
      doc: TSchema,
    ): Promise<TDocument & TSchema>;

    /**
     * Insert multiple documents.
     *
     * This is just an alias for `insert` with array destructuring
     * to ensure multiple documents.
     */
    insertMany<TSchema>(
      docs: TSchema[],
    ): Promise<(TDocument & TSchema)[]>;
  
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
     */
    update<TSchema>(
      query: Query,
      update: Update,
      options: UpdateOptions & { returnUpdatedDocs: true; upsert: true; multi?: false },
    ): Promise<TDocument & TSchema>;
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
     */
    update<TSchema>(
      query: Query,
      update: Update,
      options: UpdateOptions & { returnUpdatedDocs: true; upsert: true; multi: true },
    ): Promise<(TDocument & TSchema)[] | (TDocument & TSchema)>;
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
     */
    update<TSchema>(
      query: Query,
      update: Update,
      options: UpdateOptions & { returnUpdatedDocs: true; upsert?: false; multi?: false },
    ): Promise<(TDocument & TSchema) | null>;
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
     */
    update<TSchema>(
      query: Query,
      update: Update,
      options: UpdateOptions & { returnUpdatedDocs: true; multi: true },
    ): Promise<(TDocument & TSchema)[]>;
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
     */
    update<TSchema>(
      query: Query,
      update: Update,
      options?: UpdateOptions,
    ): Promise<number>;
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
     */
     update(
      query: Query,
      update: Update,
      options?: UpdateOptions,
    ): Promise<number>;

    /**
     * Update a single document that matches the specified `query`.
     *
     * This is just an alias for `update` with `options.multi` set to `false`.
     */
    updateOne<TSchema>(
      query: Query,
      update: Update,
      options: UpdateOptions & { returnUpdatedDocs: true; upsert: true },
    ): Promise<TDocument & TSchema>;
    /**
     * Update a single document that matches the specified `query`.
     *
     * This is just an alias for `update` with `options.multi` set to `false`.
     */
    updateOne<TSchema>(
      query: Query,
      update: Update,
      options: UpdateOptions & { returnUpdatedDocs: true; upsert?: false },
    ): Promise<(TDocument & TSchema) | null>;
    /**
     * Update a single document that matches the specified `query`.
     *
     * This is just an alias for `update` with `options.multi` set to `false`.
     */
    updateOne<TSchema>(
      query: Query,
      update: Update,
      options?: UpdateOptions,
    ): Promise<number>;
    /**
     * Update a single document that matches the specified `query`.
     *
     * This is just an alias for `update` with `options.multi` set to `false`.
     */
    updateOne(
      query: Query,
      update: Update,
      options?: UpdateOptions,
    ): Promise<number>;

    /**
     * Update multiple documents that match the specified `query`.
     *
     * This is just an alias for `update` with `options.multi` set to `true`.
     */
    updateMany<TSchema>(
      query: Query,
      update: Update,
      options: UpdateOptions & { returnUpdatedDocs: true; upsert: true },
    ): Promise<(TDocument & TSchema)[] | (TDocument & TSchema)>;
    /**
     * Update multiple documents that match the specified `query`.
     *
     * This is just an alias for `update` with `options.multi` set to `true`.
     */
    updateMany<TSchema>(
      query: Query,
      update: Update,
      options: UpdateOptions & { returnUpdatedDocs: true },
    ): Promise<(TDocument & TSchema)[]>;
    /**
     * Update multiple documents that match the specified `query`.
     *
     * This is just an alias for `update` with `options.multi` set to `true`.
     */
    updateMany<TSchema>(
      query: Query,
      update: Update,
      options?: UpdateOptions,
    ): Promise<number>;
    /**
     * Update multiple documents that match the specified `query`.
     *
     * This is just an alias for `update` with `options.multi` set to `true`.
     */
    updateMany(
      query: Query,
      update: Update,
      options?: UpdateOptions,
    ): Promise<number>;

    /**
     * Remove documents that match the specified `query`.
     *
     * It's basically the same as the original:
     * https://github.com/louischatriot/nedb#removing-documents
     */
    remove(query: Query, options: RemoveOptions): Promise<number>;

    /**
     * Remove the first document that matches the specified `query`.
     *
     * This is just an alias for `remove` with `options.multi` set to `false`.
     */
    removeOne(query: Query, options: RemoveOptions): Promise<number>;

    /**
     * Remove all documents that match the specified `query`.
     *
     * This is just an alias for `remove` with `options.multi` set to `true`.
     */
    removeMany(query: Query, options: RemoveOptions): Promise<number>;

    /**
     * Remove the first document that matches the specified `query`.
     *
     * This is just an alias for `removeOne`.
     */
    deleteOne(query: Query, options: RemoveOptions): Promise<number>;

    /**
     * Remove all documents that match the specified `query`.
     *
     * This is just an alias for `removeMany`.
     */
    deleteMany(query: Query, options: RemoveOptions): Promise<number>;

    /**
     * Count documents matching the specified `query`.
     */
    count(query: Query): Promise<number>;

    /**
     * Ensure an index is kept for this field. Same parameters as lib/indexes
     * For now this function is synchronous, we need to test how much time it
     * takes We use an async API for consistency with the rest of the code.
     */
    ensureIndex(options: IndexOptions): Promise<void>;

    /**
     * Remove an index.
     */
    removeIndex(fieldName: string): Promise<void>;
  }
}

export = NeDB.Datastore;
