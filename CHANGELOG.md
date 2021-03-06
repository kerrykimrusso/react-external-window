# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
* Remove `beta` from version `1.0.0` in `CHANGELOG`


## [1.0.0] / 2018-07-04

### Added
* `resources` prop which accepts an `Array` of resources (see [README](README.md))
* `prop-types` validation to `Window` component

### Changed
* Must explicitly copy parent `<style />`s using the `resources` prop (see [README](README.md) for an example)

### Removed
* `stylesheet` prop, which is replaced by `resources`



## [0.2.0] / 2018-06-16

* Add `stylesheet` prop which accepts an absolute URL to a style resource
* Copy parent `<style />`s by default unless a `stylesheet` prop is passed



## [0.1.1] / 2018-06-15

* Fix import of `Window` in example documentation



## [0.1.0] / 2018-06-14

* Initial release!
