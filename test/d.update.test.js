const assert = require("node:assert");
const { describe, it, beforeEach, afterEach } = require("node:test");
const Datastore = require("../src/Datastore");

describe("testing document update", () => {
  const docs = [
    { name: "1st document" },
    { name: "2nd document" },
    { name: "3rd document" },
  ];

  const datastore = Datastore.create();
  beforeEach(() => datastore.insert(docs));
  afterEach(() => datastore.remove({}, { multi: true }));

  describe("single", () => {
    it("should update single document", async () => {
      const { _id } = await datastore.findOne({ name: /^1st/ });
      const numAffected = await datastore.update(
        { name: /^1st/ },
        { test: true },
        { multi: false },
      );
      assert.strictEqual(numAffected, 1);
      const affectedDoc = await datastore.findOne({ test: true });
      assert.strictEqual(affectedDoc._id, _id);
      assert.strictEqual(affectedDoc.test, true);
    });
  });

  describe("single with returnUpdatedDocs", () => {
    it("should update and return single document", async () => {
      const { _id } = await datastore.findOne({ name: /^1st/ });
      const affectedDoc = await datastore.update(
        { name: "1st document" },
        { test: true },
        { multi: false, returnUpdatedDocs: true },
      );

      assert.strictEqual(affectedDoc._id, _id);
      assert.strictEqual(affectedDoc.test, true);
    });
  });

  describe("bulk", () => {
    it("should update multiple documents", async () => {
      const numAffected = await datastore.update(
        { name: { $regex: /^1st|2nd/ } },
        { $set: { test: true } },
        { multi: true },
      );

      assert.strictEqual(numAffected, 2);
      const affectedDocs = await datastore.find({ test: true });
      assert.strictEqual(affectedDocs.length, 2);
      affectedDocs.forEach((affectedDoc) => {
        assert.ok(affectedDoc.name.match(/^1st|2nd/));
        assert.strictEqual(affectedDoc.test, true);
      });
    });
  });

  describe("bulk with returnUpdatedDocs", () => {
    it("should update and return multiple documents", async () => {
      const affectedDocs = await datastore.update(
        { name: { $regex: /^2nd|3rd/ } },
        { $set: { test: true } },
        { multi: true, returnUpdatedDocs: true },
      );

      assert.strictEqual(affectedDocs.length, 2);
      affectedDocs.forEach((affectedDoc) => {
        assert.ok(affectedDoc.name.match(/^2nd|3rd/));
        assert.strictEqual(affectedDoc.test, true);
      });
    });
  });
});
