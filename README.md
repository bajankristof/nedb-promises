![nedb-promises](https://github.com/bajankristof/nedb-promises/blob/master/logo.svg "nedb-promises")

A dead-simple promise wrapper for [nedb](https://github.com/louischatriot/nedb#readme).

```js
const Datastore = require('nedb-promises');
let db = Datastore.create('/path/to/db.db');

// #1
db.find({ field: true })
  .then(...)
  .catch(...);
  
// #2
db.find({ field: true })
  .exec(...)
  .then(...)
  .catch(...);

// #1 and #2 are equivalent

db.findOne({ field: true })
  .then(...)
  .catch(...);
  
db.insert({ doc: 'yourdoc', createdAt: Date.now() })
  .then(...)
  .catch(...);
```

### Usage
Everything works as the original module, with three major exceptions. 
* There are no callbacks.
* `loadDatabase` has been renamed to `load`.
* You should call `Datastore.create(...)` instead of `new Datastore(...)`. This way you can access the original [nedb](https://github.com/louischatriot/nedb#readme) properties, such as `datastore.persistence`.

[Check out the original documentation!](https://github.com/louischatriot/nedb#readme)

#### load( )
You don't need to call this as the module will automatically detect if the datastore has been loaded or not upon calling any other method. 
```js
const Datastore = require('nedb-promises');
let db = Datastore.create('/path/to/db.db');
db.load(...)
  .then(...)
  .catch(...)
```

#### find( query [, projection ] )
This will return a Cursor object that works the same way it did before except when you call "exec" it takes no arguments and returns a Promise.

##### update on Cursor objects
With the `1.1.0` update now you can simply call `.then(...)` on a Cursor to request the documents in a Promise. 

Note that `.exec()` is still necessary when `.find()` is in the `.then()` of a Promise chain (otherwise the promise would be resolved with the Cursor object).

```js
const Datastore = require('nedb-promises');
let db = Datastore.create('/path/to/db.db');

//outside Promise chain
db.find(...)
  .then(...)
  .catch(...)
  
//insinde Promise chain
db.insert(...)
  .then(() => {
    return db.find(...).exec();
  })
  .then(
    // use the retrieved documents
  );
```

#### findOne( query [, projection ])
Unlike "find" this will not return a Cursor since it makes no sense to sort or limit a single document.
This will simply return a Promise.

#### other( ... )
All the other methods will take the same arguments as they did before (except the callback) and will return a Promise.

##### update on the update( ... ) method
This method now (`1.1.1`) accepts upsert and returnUpdatedDocs as it would with the original module.

#### Special thanks to [npeterkamps](https://github.com/npeterkamps) for the useful pull requests!

[Check out the original documentation!](https://github.com/louischatriot/nedb#readme)