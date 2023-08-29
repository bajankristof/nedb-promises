## Classes

<dl>
<dt><a href="#Cursor">Cursor</a></dt>
<dd></dd>
<dt><a href="#Datastore">Datastore</a></dt>
<dd></dd>
</dl>

<a name="Cursor"></a>

## Cursor
**Kind**: global class  

* [Cursor](#Cursor)
    * [.sort()](#Cursor+sort) ⇒ [<code>Cursor</code>](#Cursor)
    * [.skip()](#Cursor+skip) ⇒ [<code>Cursor</code>](#Cursor)
    * [.limit()](#Cursor+limit) ⇒ [<code>Cursor</code>](#Cursor)
    * [.project()](#Cursor+project) ⇒ [<code>Cursor</code>](#Cursor)
    * [.exec()](#Cursor+exec) ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code>
    * [.then(fulfilled, [rejected])](#Cursor+then) ⇒ <code>Promise</code>
    * [.catch(rejected)](#Cursor+catch) ⇒ <code>Promise</code>

<a name="Cursor+sort"></a>

### cursor.sort() ⇒ [<code>Cursor</code>](#Cursor)
Sort the queried documents.

See: https://github.com/louischatriot/nedb#sorting-and-paginating

**Kind**: instance method of [<code>Cursor</code>](#Cursor)  
<a name="Cursor+skip"></a>

### cursor.skip() ⇒ [<code>Cursor</code>](#Cursor)
Skip some of the queried documents.

See: https://github.com/louischatriot/nedb#sorting-and-paginating

**Kind**: instance method of [<code>Cursor</code>](#Cursor)  
<a name="Cursor+limit"></a>

### cursor.limit() ⇒ [<code>Cursor</code>](#Cursor)
Limit the queried documents.

See: https://github.com/louischatriot/nedb#sorting-and-paginating

**Kind**: instance method of [<code>Cursor</code>](#Cursor)  
<a name="Cursor+project"></a>

### cursor.project() ⇒ [<code>Cursor</code>](#Cursor)
Set the document projection.

See: https://github.com/louischatriot/nedb#projections

**Kind**: instance method of [<code>Cursor</code>](#Cursor)  
<a name="Cursor+exec"></a>

### cursor.exec() ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code>
Execute the cursor.

Since the Cursor has a `then` and a `catch` method
JavaScript identifies it as a thenable object
thus you can await it in async functions.

**Kind**: instance method of [<code>Cursor</code>](#Cursor)  
**Example**  
```js
// in an async function
await datastore.find(...)
 .sort(...)
 .limit(...)
```
**Example**  
```js
// the previous is the same as:
await datastore.find(...)
 .sort(...)
 .limit(...)
 .exec()
```
<a name="Cursor+then"></a>

### cursor.then(fulfilled, [rejected]) ⇒ <code>Promise</code>
Execute the cursor and set promise callbacks.

For more information visit:
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then

**Kind**: instance method of [<code>Cursor</code>](#Cursor)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>fulfilled</td><td><code>function</code></td>
    </tr><tr>
    <td>[rejected]</td><td><code>function</code></td>
    </tr>  </tbody>
</table>

<a name="Cursor+catch"></a>

### cursor.catch(rejected) ⇒ <code>Promise</code>
Execute the cursor and set promise error callback.

For more information visit:
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch

**Kind**: instance method of [<code>Cursor</code>](#Cursor)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>rejected</td><td><code>function</code></td>
    </tr>  </tbody>
</table>

<a name="Datastore"></a>

## Datastore
**Kind**: global class  
**Summary**: As of v2.0.0 the Datastore class extends node's built 
in EventEmitter class and implements each method as an event
plus additional error events. It also inherits the `compaction.done`
event from nedb but for consistency, in this library the event
was renamed to `compactionDone`.

All event callbacks will be passed the same type of values,
the first being the datastore, then the operation result (if there is any)
and then the arguments of the called method. (Check out the first example!)

All events have a matching error event that goes by the name of `${method}Error`,
for example `findError` or `loadError`. The callbacks of these events will receive
the same parameters as the normal event handlers except that instead of the 
operation result there will be an operation error. (Check out the second example!)

A generic `__error__` event is also available. This event will be emitted at any of
the above error events. The callbacks of this event will receive the same parameters
as the specific error event handlers except that there will be one more parameter 
passed between the datastore and the error object, that being the name of the method
that failed. (Check out the third example!)  

* [Datastore](#Datastore)
    * [new Datastore([pathOrOptions])](#new_Datastore_new)
    * _instance_
        * [.load()](#Datastore+load) ⇒ <code>Promise.&lt;undefined&gt;</code>
        * [.find([query], [projection])](#Datastore+find) ⇒ [<code>Cursor</code>](#Cursor)
        * [.findOne([query], [projection])](#Datastore+findOne) ⇒ [<code>Cursor</code>](#Cursor)
        * [.insert(docs)](#Datastore+insert) ⇒ <code>Promise.&lt;(Object\|Array.&lt;Object&gt;)&gt;</code>
        * [.insertOne(doc)](#Datastore+insertOne) ⇒ <code>Promise.&lt;Object&gt;</code>
        * [.insertMany(docs)](#Datastore+insertMany) ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code>
        * [.update(query, update, [options])](#Datastore+update) ⇒ <code>Promise.&lt;(number\|Object\|Array.&lt;Object&gt;)&gt;</code>
        * [.updateOne(query, update, [options])](#Datastore+updateOne) ⇒ <code>Promise.&lt;(number\|Object)&gt;</code>
        * [.updateMany(query, update, [options])](#Datastore+updateMany) ⇒ <code>Promise.&lt;(number\|Array.&lt;Object&gt;)&gt;</code>
        * [.remove([query], [options])](#Datastore+remove) ⇒ <code>Promise.&lt;number&gt;</code>
        * [.removeOne([query], [options])](#Datastore+removeOne) ⇒ <code>Promise.&lt;number&gt;</code>
        * [.removeMany([query], [options])](#Datastore+removeMany) ⇒ <code>Promise.&lt;number&gt;</code>
        * [.deleteOne([query], [options])](#Datastore+deleteOne) ⇒ <code>Promise.&lt;number&gt;</code>
        * [.deleteMany([query], [options])](#Datastore+deleteMany) ⇒ <code>Promise.&lt;number&gt;</code>
        * [.count([query])](#Datastore+count) ⇒ [<code>Cursor</code>](#Cursor)
        * [.ensureIndex(options)](#Datastore+ensureIndex) ⇒ <code>Promise.&lt;undefined&gt;</code>
        * [.removeIndex(field)](#Datastore+removeIndex) ⇒ <code>Promise.&lt;undefined&gt;</code>
    * _static_
        * [.create([pathOrOptions])](#Datastore.create) ⇒ <code>Proxy.&lt;static&gt;</code>

<a name="new_Datastore_new"></a>

### new Datastore([pathOrOptions])
Datastore constructor...

You should use `Datastore.create(...)` instead
of `new Datastore(...)`. With that you can access
the original datastore's properties such as `datastore.persistence`.

Create a Datastore instance.

Note that the datastore will be created
relative to `process.cwd()`
(unless an absolute path was passed).

It's basically the same as the original:
https://github.com/louischatriot/nedb#creatingloading-a-database

<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[pathOrOptions]</td><td><code>string</code> | <code>Object</code></td>
    </tr>  </tbody>
</table>

**Example**  
```js
let datastore = Datastore.create()
datastore.on('update', (datastore, result, query, update, options) => {
})
datastore.on('load', (datastore) => {
    // this event doesn't have a result
})
datastore.on('ensureIndex', (datastore, options) => {
    // this event doesn't have a result
    // but it has the options argument which will be passed to the
    // event handlers
})
datastore.on('compactionDone', (datastore) => {
    // inherited from nedb's compaction.done event
})
```
**Example**  
```js
let datastore = Datastore.create()
datastore.on('updateError', (datastore, error, query, update, options) => {
})
datastore.on('loadError', (datastore, error) => {
})
datastore.on('ensureIndexError', (datastore, error, options) => {
})
```
**Example**  
```js
let datastore = Datastore.create()
datastore.on('__error__', (datastore, event, error, ...args) => {
    // for example
    // datastore, 'find', error, [{ foo: 'bar' }, {}]
})
```
<a name="Datastore+load"></a>

### datastore.load() ⇒ <code>Promise.&lt;undefined&gt;</code>
Load the datastore.

Note that you don't necessarily have to call
this method to load the datastore as it will
automatically be called and awaited on any
operation issued against the datastore
(i.e.: `find`, `findOne`, etc.).

**Kind**: instance method of [<code>Datastore</code>](#Datastore)  
<a name="Datastore+find"></a>

### datastore.find([query], [projection]) ⇒ [<code>Cursor</code>](#Cursor)
Find documents that match the specified `query`.

It's basically the same as the original:
https://github.com/louischatriot/nedb#finding-documents

There are differences minor in how the cursor works though.

**Kind**: instance method of [<code>Datastore</code>](#Datastore)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[query]</td><td><code>Object</code></td>
    </tr><tr>
    <td>[projection]</td><td><code>Object</code></td>
    </tr>  </tbody>
</table>

**Example**  
```js
datastore.find({ ... }).sort({ ... }).exec().then(...)
```
**Example**  
```js
datastore.find({ ... }).sort({ ... }).then(...)
```
**Example**  
```js
// in an async function
await datastore.find({ ... }).sort({ ... })
```
<a name="Datastore+findOne"></a>

### datastore.findOne([query], [projection]) ⇒ [<code>Cursor</code>](#Cursor)
Find a document that matches the specified `query`.

It's basically the same as the original:
https://github.com/louischatriot/nedb#finding-documents

**Kind**: instance method of [<code>Datastore</code>](#Datastore)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[query]</td><td><code>Object</code></td>
    </tr><tr>
    <td>[projection]</td><td><code>Object</code></td>
    </tr>  </tbody>
</table>

**Example**  
```js
datastore.findOne({ ... }).then(...)
```
**Example**  
```js
// in an async function
await datastore.findOne({ ... }).sort({ ... })
```
<a name="Datastore+insert"></a>

### datastore.insert(docs) ⇒ <code>Promise.&lt;(Object\|Array.&lt;Object&gt;)&gt;</code>
Insert a document or documents.

It's basically the same as the original:
https://github.com/louischatriot/nedb#inserting-documents

**Kind**: instance method of [<code>Datastore</code>](#Datastore)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>docs</td><td><code>Object</code> | <code>Array.&lt;Object&gt;</code></td>
    </tr>  </tbody>
</table>

<a name="Datastore+insertOne"></a>

### datastore.insertOne(doc) ⇒ <code>Promise.&lt;Object&gt;</code>
Insert a single document.

This is just an alias for `insert` with object destructuring
to ensure a single document.

**Kind**: instance method of [<code>Datastore</code>](#Datastore)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>doc</td><td><code>Object</code></td>
    </tr>  </tbody>
</table>

<a name="Datastore+insertMany"></a>

### datastore.insertMany(docs) ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code>
Insert multiple documents.

This is just an alias for `insert` with array destructuring
to ensure multiple documents.

**Kind**: instance method of [<code>Datastore</code>](#Datastore)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>docs</td><td><code>Array.&lt;Object&gt;</code></td>
    </tr>  </tbody>
</table>

<a name="Datastore+update"></a>

### datastore.update(query, update, [options]) ⇒ <code>Promise.&lt;(number\|Object\|Array.&lt;Object&gt;)&gt;</code>
Update documents that match the specified `query`.

It's basically the same as the original:
https://github.com/louischatriot/nedb#updating-documents

If you set `options.returnUpdatedDocs`,
the returned promise will resolve with
an object (if `options.multi` is `false`) or
with an array of objects.

**Kind**: instance method of [<code>Datastore</code>](#Datastore)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>query</td><td><code>Object</code></td>
    </tr><tr>
    <td>update</td><td><code>Object</code></td>
    </tr><tr>
    <td>[options]</td><td><code>Object</code></td>
    </tr>  </tbody>
</table>

<a name="Datastore+updateOne"></a>

### datastore.updateOne(query, update, [options]) ⇒ <code>Promise.&lt;(number\|Object)&gt;</code>
Update a single document that matches the specified `query`.

This is just an alias for `update` with `options.multi` set to `false`.

**Kind**: instance method of [<code>Datastore</code>](#Datastore)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>query</td><td><code>Object</code></td>
    </tr><tr>
    <td>update</td><td><code>Object</code></td>
    </tr><tr>
    <td>[options]</td><td><code>Object</code></td>
    </tr>  </tbody>
</table>

<a name="Datastore+updateMany"></a>

### datastore.updateMany(query, update, [options]) ⇒ <code>Promise.&lt;(number\|Array.&lt;Object&gt;)&gt;</code>
Update multiple documents that match the specified `query`.

This is just an alias for `update` with `options.multi` set to `true`.

**Kind**: instance method of [<code>Datastore</code>](#Datastore)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>query</td><td><code>Object</code></td>
    </tr><tr>
    <td>update</td><td><code>Object</code></td>
    </tr><tr>
    <td>[options]</td><td><code>Object</code></td>
    </tr>  </tbody>
</table>

<a name="Datastore+remove"></a>

### datastore.remove([query], [options]) ⇒ <code>Promise.&lt;number&gt;</code>
Remove documents that match the specified `query`.

It's basically the same as the original:
https://github.com/louischatriot/nedb#removing-documents

**Kind**: instance method of [<code>Datastore</code>](#Datastore)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[query]</td><td><code>Object</code></td>
    </tr><tr>
    <td>[options]</td><td><code>Object</code></td>
    </tr>  </tbody>
</table>

<a name="Datastore+removeOne"></a>

### datastore.removeOne([query], [options]) ⇒ <code>Promise.&lt;number&gt;</code>
Remove the first document that matches the specified `query`.

This is just an alias for `remove` with `options.multi` set to `false`.

**Kind**: instance method of [<code>Datastore</code>](#Datastore)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[query]</td><td><code>Object</code></td>
    </tr><tr>
    <td>[options]</td><td><code>Object</code></td>
    </tr>  </tbody>
</table>

<a name="Datastore+removeMany"></a>

### datastore.removeMany([query], [options]) ⇒ <code>Promise.&lt;number&gt;</code>
Remove all documents that match the specified `query`.

This is just an alias for `remove` with `options.multi` set to `true`.

**Kind**: instance method of [<code>Datastore</code>](#Datastore)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[query]</td><td><code>Object</code></td>
    </tr><tr>
    <td>[options]</td><td><code>Object</code></td>
    </tr>  </tbody>
</table>

<a name="Datastore+deleteOne"></a>

### datastore.deleteOne([query], [options]) ⇒ <code>Promise.&lt;number&gt;</code>
Remove the first document that matches the specified `query`.

This is just an alias for `removeOne`.

**Kind**: instance method of [<code>Datastore</code>](#Datastore)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[query]</td><td><code>Object</code></td>
    </tr><tr>
    <td>[options]</td><td><code>Object</code></td>
    </tr>  </tbody>
</table>

<a name="Datastore+deleteMany"></a>

### datastore.deleteMany([query], [options]) ⇒ <code>Promise.&lt;number&gt;</code>
Remove all documents that match the specified `query`.

This is just an alias for `removeMany`.

**Kind**: instance method of [<code>Datastore</code>](#Datastore)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[query]</td><td><code>Object</code></td>
    </tr><tr>
    <td>[options]</td><td><code>Object</code></td>
    </tr>  </tbody>
</table>

<a name="Datastore+count"></a>

### datastore.count([query]) ⇒ [<code>Cursor</code>](#Cursor)
Count documents matching the specified `query`.

It's basically the same as the original:
https://github.com/louischatriot/nedb#counting-documents

**Kind**: instance method of [<code>Datastore</code>](#Datastore)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[query]</td><td><code>Object</code></td>
    </tr>  </tbody>
</table>

**Example**  
```js
datastore.count({ ... }).limit(...).then(...)
```
**Example**  
```js
// in an async function
await datastore.count({ ... })
// or
await datastore.count({ ... }).sort(...).limit(...)
```
<a name="Datastore+ensureIndex"></a>

### datastore.ensureIndex(options) ⇒ <code>Promise.&lt;undefined&gt;</code>
https://github.com/louischatriot/nedb#indexing

**Kind**: instance method of [<code>Datastore</code>](#Datastore)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>options</td><td><code>Object</code></td>
    </tr>  </tbody>
</table>

<a name="Datastore+removeIndex"></a>

### datastore.removeIndex(field) ⇒ <code>Promise.&lt;undefined&gt;</code>
https://github.com/louischatriot/nedb#indexing

**Kind**: instance method of [<code>Datastore</code>](#Datastore)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>field</td><td><code>string</code></td>
    </tr>  </tbody>
</table>

<a name="Datastore.create"></a>

### Datastore.create([pathOrOptions]) ⇒ <code>Proxy.&lt;static&gt;</code>
Create a database instance.

Use this over `new Datastore(...)` to access
original nedb datastore properties, such as
`datastore.persistence`.

Note that this method only creates the `Datastore`
class instance, not the datastore file itself.
The file will only be created once an operation
is issued against the datastore or if you call
the `load` instance method explicitly.

The path (if specified) will be relative to `process.cwd()`
(unless an absolute path was passed).

For more information visit:
https://github.com/louischatriot/nedb#creatingloading-a-database

**Kind**: static method of [<code>Datastore</code>](#Datastore)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[pathOrOptions]</td><td><code>string</code> | <code>Object</code></td>
    </tr>  </tbody>
</table>

