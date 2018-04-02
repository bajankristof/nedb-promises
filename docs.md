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
    * [.exec()](#Cursor+exec) ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code>
    * [.then(fulfilled, [rejected])](#Cursor+then) ⇒ <code>Promise</code>
    * [.catch(rejected)](#Cursor+catch) ⇒ <code>Promise</code>

<a name="Cursor+exec"></a>

### cursor.exec() ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code>
Execute the cursor.

You can use the same cursor methods
that you could with the original module:

https://github.com/louischatriot/nedb#sorting-and-paginating

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

* [Datastore](#Datastore)
    * [new Datastore([options])](#new_Datastore_new)
    * _instance_
        * [.load()](#Datastore+load) ⇒ <code>Promise</code>
        * [.find([query], [projection])](#Datastore+find) ⇒ [<code>Cursor</code>](#Cursor)
        * [.findOne([query], [projection])](#Datastore+findOne) ⇒ <code>Promise.&lt;Object&gt;</code>
        * [.insert(docs)](#Datastore+insert) ⇒ <code>Promise.&lt;(Object\|Array.&lt;Object&gt;)&gt;</code>
        * [.update(query, update, [options])](#Datastore+update) ⇒ <code>Promise.&lt;(number\|Object\|Array.&lt;Object&gt;)&gt;</code>
        * [.remove([query], [options])](#Datastore+remove) ⇒ <code>Promise.&lt;number&gt;</code>
        * [.count([query])](#Datastore+count) ⇒ <code>Promise.&lt;number&gt;</code>
        * [.ensureIndex(options)](#Datastore+ensureIndex) ⇒ <code>Promise</code>
        * [.removeIndex(field)](#Datastore+removeIndex) ⇒ <code>Promise</code>
    * _static_
        * [.create(options)](#Datastore.create) ⇒ <code>Proxy.&lt;static&gt;</code>

<a name="new_Datastore_new"></a>

### new Datastore([options])
Datastore constructor...

You should use `Datastore.create(...)` instead
of `new Datastore(...)`. With that you can access
the original datastore's properties such as `datastore.persistance`.

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
    <td>[options]</td><td><code>Object</code></td>
    </tr>  </tbody>
</table>

<a name="Datastore+load"></a>

### datastore.load() ⇒ <code>Promise</code>
Load the datastore.

**Kind**: instance method of [<code>Datastore</code>](#Datastore)  
<a name="Datastore+find"></a>

### datastore.find([query], [projection]) ⇒ [<code>Cursor</code>](#Cursor)
Find documents that match a query.

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

### datastore.findOne([query], [projection]) ⇒ <code>Promise.&lt;Object&gt;</code>
Find a document that matches a query.

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

<a name="Datastore+update"></a>

### datastore.update(query, update, [options]) ⇒ <code>Promise.&lt;(number\|Object\|Array.&lt;Object&gt;)&gt;</code>
Update documents that match a query.

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

<a name="Datastore+remove"></a>

### datastore.remove([query], [options]) ⇒ <code>Promise.&lt;number&gt;</code>
Remove documents that match a query.

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

<a name="Datastore+count"></a>

### datastore.count([query]) ⇒ <code>Promise.&lt;number&gt;</code>
Count documents that match a query.

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

<a name="Datastore+ensureIndex"></a>

### datastore.ensureIndex(options) ⇒ <code>Promise</code>
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

### datastore.removeIndex(field) ⇒ <code>Promise</code>
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

### Datastore.create(options) ⇒ <code>Proxy.&lt;static&gt;</code>
Create a database instance.

Use this over `new Datastore(...)` to access
original nedb datastore properties, such as
`datastore.persistance`.

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
    <td>options</td><td><code>string</code> | <code>Object</code></td>
    </tr>  </tbody>
</table>

