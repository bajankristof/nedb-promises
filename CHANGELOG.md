# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 6.2.2
### Fixed
- Vulnerable dependencies.

## 6.2.1
### Fixed
- Updated TypeScript declarations to match the current API.

## 6.2.0
### Added
- `Datastore.removeOne` and `Datastore.removeMany` aliases.
- MongoDB compatibility methods (`Datastore.insertOne`, `Datastore.insertMany`, `Datastore.updateOne`, `Datastore.updateMany`, `Datastore.deleteOne`, `Datastore.deleteMany`).

## 6.1.0
### Updated
- Code to use the async API instead of callbacks.

### Fixed
- Vulnerable dependencies.

## 6.0.3
### Fixed
- Vulnerable dependencies.

## 6.0.2
### Fixed
- TypeScript declaration `update` result when `upsert` and `multi` is set to `true`.

## 6.0.1
### Updated
- Class description in the TypeScript declaration file.

## 6.0.0
### Added
- `Cursor.project` method.

### Changed
- Major TypeScript declaration overhaul.

## 5.0.1 - 5.0.3
### Fixed
- Vulnerable dependencies.

### Updated
- Code style.
- Some documentation issues.

## 5.0.0
### Updated
- Switched from `nedb` to `@seald-io/nedb`, to solve vulnerability issues.

## 4.1.4 - 4.1.6
### Fixed
- Vulnerable dependencies.

## 4.1.1 - 4.1.3
### Updated
- TypeScript definition file.

## 4.1.0
### Added
- `compactionDone` event from nedb's `compaction.done`

## 4.0.4
### Updated
- Vulnerable dependencies.
- Tabs to spaces in code.
- TypeScript definition file.

## 4.0.1
### Updated
- Vulnerable dependencies.

## 4.0.0
### Updated
- The [findOne](https://github.com/bajankristof/nedb-promises/blob/master/docs.md#Datastore+findOne) and [count](https://github.com/bajankristof/nedb-promises/blob/master/docs.md#Datastore+count) `Datastore` methods now return a `Cursor` object instead of a `Promise`, allowing users to e.g.: find the most recently updated document, etc.
