const assert = require("node:assert");
const { describe, it } = require("node:test");
const Datastore = require("../src/Datastore");

describe("testing document insertion", () => {
  const docs = [
    { name: "1st document" },
    { name: "2nd document" },
    { name: "3rd document" },
  ];

  describe("single", () => {
    it("should insert single document", async () => {
      const datastore = Datastore.create();
      const insertedDoc = await datastore.insert(docs[0]);
      assert.match(insertedDoc.name, /^1st document$/);
      assert.ok(Object.hasOwn(insertedDoc, "_id"));
    });
  });

  describe("bulk", () => {
    it("should insert multiple documents", async () => {
      const datastore = Datastore.create();
      const insertedDocs = await datastore.insert(docs);
      assert.strictEqual(insertedDocs.length, 3);
      insertedDocs.forEach((insertedDoc, index) => {
        assert.strictEqual(insertedDoc.name, docs[index].name);
      });
    });
  });
});
