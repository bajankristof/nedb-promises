const assert = require("node:assert");
const { describe, it } = require("node:test");
const Datastore = require("../src/Datastore");

describe("testing MongoDB compatibility methods", () => {
  describe("insertOne", () => {
    it("should insert a single document event when passed an array", async () => {
      const datastore = Datastore.create();
      const result = await datastore.insertOne([{ foo: true }, { bar: false }]);
      assert.strictEqual(Array.isArray(result), false);
      assert.deepStrictEqual(result["0"], { foo: true });
      assert.strictEqual(await datastore.count(), 1);
    });
  });

  describe("insertMany", () => {
    it("should throw when passed a non-iterable value", async () => {
      const datastore = Datastore.create();
      assert.throws(() => datastore.insertMany({}));
    });

    it("should insert the specified documents otherwise", async () => {
      const datastore = Datastore.create();
      await datastore.insertMany([{}, {}]);
      assert.strictEqual(await datastore.count(), 2);
    });
  });

  describe("updateOne", () => {
    it("should update a single document", async () => {
      const datastore = Datastore.create();
      await datastore.insert([{}, {}]);
      await datastore.updateOne({}, { $set: { foo: true } }, { multi: true });
      assert.strictEqual(await datastore.count({ foo: true }), 1);
    });
  });

  describe("updateMany", () => {
    it("should update multiple documents", async () => {
      const datastore = Datastore.create();
      await datastore.insert([{}, {}]);
      await datastore.updateMany({}, { $set: { foo: true } }, { multi: false });
      assert.strictEqual(await datastore.count({ foo: true }), 2);
    });
  });

  describe("deleteOne", () => {
    it("should update a single document", async () => {
      const datastore = Datastore.create();
      await datastore.insert([{}, {}]);
      await datastore.deleteOne({}, { multi: true });
      assert.strictEqual(await datastore.count(), 1);
    });
  });

  describe("deleteMany", () => {
    it("should update multiple documents", async () => {
      const datastore = Datastore.create();
      await datastore.insert([{}, {}]);
      await datastore.deleteMany({}, { multi: false });
      assert.strictEqual(await datastore.count(), 0);
    });
  });
});
