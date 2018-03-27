const {expect} = require('chai'),
  Datastore = require('../src/Datastore');

describe('Update', () => {
  let documents = [
    { name: 'first document' },
    { name: 'second document' },
    { name: 'third document' }
  ];

  describe(`single`, () => {
    it('should update single document', () => {
      let db = Datastore.create();
      return db.insert(documents)
        .then((inserted) => {
          return db.update(
            { name: 'first document' },
            { name: 'updated document' },
            { multi: false }
          );
        })
        .then((numAffected) => {
          expect(numAffected).to.equal(1);
        });
    });
  });

  describe(`single affected`, () => {
    it('should update and return single document', () => {
      let db = Datastore.create();
      return db.insert(documents)
        .then((inserted) => {
          return db.update(
            { name: 'first document' },
            { name: 'updated document' },
            { multi: false, returnUpdatedDocs: true }
          );
        })
        .then(([numAffected, affectedDocument]) => {
          expect(numAffected).to.equal(1);
          expect(affectedDocument).to.deep.include({
            name: 'updated document'
          });
        });
    });
  });

  describe(`bulk`, () => {
    it('should update multiple documents', () => {
      let db = Datastore.create();
      return db.insert(documents)
        .then((inserted) => {
          return db.update(
            { name: { $regex: /document$/ } },
            { $set: { test: true } },
            { multi: true }
          );
        })
        .then((numAffected) => {
          expect(numAffected).to.equal(3);
        });
    });
  });

  describe(`bulk affected`, () => {
    it('should update and return multiple documents', () => {
      let db = Datastore.create();
      return db.insert(documents)
        .then((inserted) => {
          return db.update(
            { name: { $regex: /document$/ } },
            { $set: { test: true } },
            { multi: true, returnUpdatedDocs: true }
          );
        })
        .then(([numAffected, affectedDocuments]) => {
          expect(numAffected).to.equal(3);
          expect(affectedDocuments).to.be.an('array').that.has.lengthOf(3);
        });
    });
  });
});