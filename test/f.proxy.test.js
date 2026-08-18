const assert = require("node:assert");
const { describe, it } = require("node:test");
const Cursor = require("../src/Cursor");
const Datastore = require("../src/Datastore");
const Persistence = require("@seald-io/nedb/lib/persistence");

describe("testing datastore proxy", () => {
  const datastore = Datastore.create("test.db");

  it("should not affect promise returns", () => {
    assert.strictEqual(datastore.find({}) instanceof Cursor, true);
    assert.strictEqual(
      datastore.insert({ proxy: true }) instanceof Promise,
      true,
    );
  });

  it("should return original datastore values", () => {
    assert.strictEqual(datastore.persistence instanceof Persistence, true);
  });
});
