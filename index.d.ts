import { EventEmitter } from 'events'

// Type definitions for NeDB 1.8
// Project: https://github.com/bajankristof/nedb-promises
// Definitions by: Sam Denty <https://github.com/samdenty99>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
export = Datastore
export as namespace Datastore

type Document = {
  _id: string
  createdAt?: Date
  updatedAt?: Date
}

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
 * A generic `error` event is also available. This event will be emitted at any of
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
 * datastore.on('error', (datastore, event, error, ...args) => {
 *     // for example
 *     // datastore, 'find', error, [{ foo: 'bar' }, {}]
 * })
 *
 * @class
 */
declare class Datastore extends EventEmitter {

  persistence: Nedb.Persistence

  /**
   * Datastore constructor...
   *
   * You should use `Datastore.create(...)` instead
   * of `new Datastore(...)`. With that you can access
   * the original datastore's properties such as `datastore.persistence`.
   *
   * It's basically the same as the original:
   * https://github.com/louischatriot/nedb#creatingloading-a-database
   */
  constructor(pathOrOptions?: string | Nedb.DatastoreOptions)

  /**
   * Load the datastore.
   */
  load(): Promise<undefined>

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
   */
  find<T>(query: any, projection?: {[p in keyof T | '_id' | 'createdAt' | 'updatedAt']?:number}): Nedb.Cursor<T & Document>

  /**
   * Find a document that matches a query.
   *
   * It's basically the same as the original:
   * https://github.com/louischatriot/nedb#finding-documents
   */
  findOne<T>(query: any, projection?: {[p in keyof T | '_id' | 'createdAt' | 'updatedAt']?:number}): Promise<T & Document>

  /**
   * Insert a document or documents.
   *
   * It's basically the same as the original:
   * https://github.com/louischatriot/nedb#inserting-documents
   *
   * @param  {Object|Object[]} docs
   * @return {Promise.<Object|Object[]>}
   */
  insert<T extends any | any[]>(docs: T): Promise<T & Document>

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
   */

  update<T>(
    query: any,
    updateQuery: any,
    options?: Nedb.UpdateOptions & { returnUpdatedDocs?: false }
  ): Promise<number>

  update<T>(
    query: any,
    updateQuery: any,
    options?: Nedb.UpdateOptions & { returnUpdatedDocs: true; multi?: false }
  ): Promise<T & Document>

  update<T>(
    query: any,
    updateQuery: any,
    options?: Nedb.UpdateOptions & { returnUpdatedDocs: true; multi: true }
  ): Promise<(T & Document)[]>

  /**
   * Remove documents that match a query.
   *
   * It's basically the same as the original:
   * https://github.com/louischatriot/nedb#removing-documents
   */
  remove(query: any, options: Nedb.RemoveOptions): Promise<number>

  /**
   * Count all documents matching the query
   * @param query MongoDB-style query
   */
  count(query: any): Promise<number>

  /**
   * Ensure an index is kept for this field. Same parameters as lib/indexes
   * For now this function is synchronous, we need to test how much time it takes
   * We use an async API for consistency with the rest of the code
   */
  ensureIndex(options: Nedb.EnsureIndexOptions): Promise<undefined>

  /**
   * Remove an index
   */
  removeIndex(fieldName: string): Promise<undefined>

  /**
   * Create a database instance.
   *
   * Use this over `new Datastore(...)` to access
   * original nedb datastore properties, such as
   * `datastore.persistence`.
   *
   * For more information visit:
   * https://github.com/louischatriot/nedb#creatingloading-a-database
   */
  static create(pathOrOptions?: string | Nedb.DatastoreOptions): Datastore
}

declare namespace Nedb {
  interface Cursor<T> extends Promise<T[]> {
    sort(query: any): Cursor<T>
    skip(n: number): Cursor<T>
    limit(n: number): Cursor<T>
    projection(projection: {[p in keyof T | '_id' | 'createdAt' | 'updatedAt']?:number}): Cursor<T>
    exec(): Promise<T[]>
  }

  interface DatastoreOptions {
    filename?: string // Optional, datastore will be in-memory only if not provided
    inMemoryOnly?: boolean // Optional, default to false
    nodeWebkitAppName?: boolean // Optional, specify the name of your NW app if you want options.filename to be relative to the directory where
    autoload?: boolean // Optional, defaults to false
    // Optional, if autoload is used this will be called after the load database with the error object as parameter. If you don't pass it the error will be thrown
    onload?(error: Error): any
    // (optional): hook you can use to transform data after it was serialized and before it is written to disk.
    // Can be used for example to encrypt data before writing database to disk.
    // This function takes a string as parameter (one line of an NeDB data file) and outputs the transformed string, which must absolutely not contain a \n character (or data will be lost)
    afterSerialization?(line: string): string
    // (optional): reverse of afterSerialization.
    // Make sure to include both and not just one or you risk data loss.
    // For the same reason, make sure both functions are inverses of one another.
    // Some failsafe mechanisms are in place to prevent data loss if you misuse the serialization hooks:
    // NeDB checks that never one is declared without the other, and checks that they are reverse of one another by testing on random strings of various lengths.
    // In addition, if too much data is detected as corrupt,
    // NeDB will refuse to start as it could mean you're not using the deserialization hook corresponding to the serialization hook used before (see below)
    beforeDeserialization?(line: string): string
    // (optional): between 0 and 1, defaults to 10%. NeDB will refuse to start if more than this percentage of the datafile is corrupt.
    // 0 means you don't tolerate any corruption, 1 means you don't care
    corruptAlertThreshold?: number
    // (optional, defaults to false)
    // timestamp the insertion and last update of all documents, with the fields createdAt and updatedAt. User-specified values override automatic generation, usually useful for testing.
    timestampData?: boolean
  }

  /**
   * multi (defaults to false) which allows the modification of several documents if set to true
   * upsert (defaults to false) if you want to insert a new document corresponding to the update rules if your query doesn't match anything
   */
  interface UpdateOptions {
    multi?: boolean
    upsert?: boolean
    returnUpdatedDocs?: boolean
  }

  /**
   * options only one option for now: multi which allows the removal of multiple documents if set to true. Default is false
   */
  interface RemoveOptions {
    multi?: boolean
  }

  interface EnsureIndexOptions {
    fieldName: string
    unique?: boolean
    sparse?: boolean
  }

  interface Persistence {
    compactDatafile(): void
    setAutocompactionInterval(interval: number): void
    stopAutocompaction(): void
  }
}
