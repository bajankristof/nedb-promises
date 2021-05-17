# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 4.1.4
### Fixed
- `underscore` security vulnerability

## 4.1.1 - 4.1.3
- typescript definition file updates

## 4.1.0
### Added
- `compactionDone` event from nedb's `compaction.done`

## 4.0.4
### Updated
- vulnerable dependencies
- tabs to spaces in code
- typescript doc file

## 4.0.1
### Changed
- Updated dependencies

## 4.0.0
### Changed
- The [findOne](https://github.com/bajankristof/nedb-promises/blob/master/docs.md#Datastore+findOne) and [count](https://github.com/bajankristof/nedb-promises/blob/master/docs.md#Datastore+count) `Datastore` methods now return a `Cursor` object instead of a `Promise`, allowing users to e.g.: find the most recently updated document, etc.
