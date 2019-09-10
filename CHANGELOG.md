# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 4.0.0
### Changed
- The `findOne` and `count` `Datastore` methods now return a cursor instead of a plain `Promise` allowing users to e.g.: find the most recently updated document, etc.
