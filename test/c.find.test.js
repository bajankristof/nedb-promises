const assert = require("node:assert");
const { describe, it, beforeEach, afterEach } = require("node:test");
const Datastore = require("../src/Datastore");

describe("testing document finding", () => {
  const docs = [
    { name: "1st document" },
    { name: "2nd document" },
    { name: "3rd document" },
  ];

  const datastore = Datastore.create();
  beforeEach(() => datastore.insert(docs));
  afterEach(() => datastore.remove({}, { multi: true }));

  describe("single", () => {
    it("should find the first inserted doc", async () => {
      const foundDoc = await datastore.findOne();
      assert.ok(Object.hasOwn(foundDoc, "_id"));
      assert.ok(Object.hasOwn(foundDoc, "name"));
      assert.match(foundDoc.name, /^(1st|2nd|3rd) document$/);
    });

    it("should find the last inserted doc when sorting backwards", async () => {
      const foundDoc = await datastore.findOne().sort({ name: -1 });
      assert.ok(Object.hasOwn(foundDoc, "_id"));
      assert.ok(Object.hasOwn(foundDoc, "name"));
      assert.strictEqual(foundDoc.name, "3rd document");
    });
  });

  describe("bulk", () => {
    it("should find all inserted docs", async () => {
      const foundDocs = await datastore.find().sort({ name: 1 }).exec();
      foundDocs.forEach((foundDoc, index) => {
        assert.strictEqual(foundDoc.name, docs[index].name);
      });
    });
  });

  describe("find().then()", () => {
    it("should find all inserted docs", async () => {
      const foundDocs = await datastore.find().sort({ name: 1 });
      foundDocs.forEach((foundDoc, index) => {
        assert.strictEqual(foundDoc.name, docs[index].name);
      });
    });
  });
});
