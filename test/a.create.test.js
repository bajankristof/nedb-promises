const fs = require("node:fs");
const assert = require("node:assert");
const { describe, it } = require("node:test");
const Datastore = require("../src/Datastore");

describe("testing datastore creation", () => {
  describe("new Datastore('foo.db')", () => {
    it("should create foo.db based on string filename", async () => {
      const datastore = Datastore.create("foo.db");
      await datastore.load();
      assert.strictEqual(fs.existsSync("foo.db"), true);
      fs.unlinkSync("foo.db");
    });
  });

  describe("new Datastore({ filename: 'bar.db' })", () => {
    it("sould create bar.db based on object parameters", async () => {
      const datastore = Datastore.create({ filename: "bar.db" });
      await datastore.load();
      assert.strictEqual(fs.existsSync("bar.db"), true);
      fs.unlinkSync("bar.db");
    });
  });

  describe("new Datastore()", () => {
    it("should create in memory only database", () => {
      const datastore = Datastore.create();
      assert.strictEqual(datastore.inMemoryOnly, true);
    });
  });
});
