Change log
==========

## [1.2.2] - 2018-01-30

### Changes

* Made authentication method pluggable
* Added support for yet another wave mime type

## [1.2.1] - 2018-01-24

### Changes

* Fixed export of UI

## [1.2.0] - 2018-01-12

### Changes

* All packages updated
* TypeScript is now at 2.6.2
* Made React and Radium required dependencies again
* Fixed importing from TypeScript

## [1.1.0] — 2017-06-19

### Added

* Support for dropping application specific attachments

## [1.0.0] — 2017-02-02

### Added

* Tonality support when dropping

### Changes

* Webpack, TypeScript, and TSLint packages updated. TypeScript and TSLint
  pinned to specific versions to avoid future breakage.

## [0.4.2] — 2017-01-20

### Bugfixes

* Updated accepted mime types for audio files.

## [0.4.1] — 2016-11-28

### Bugfixes

* Drop did not work in Safari 9 or MobileSafari on iOS 9.

## [0.4.0] — 2016-11-17

### Breaking changes

* `Allihoopa.drop`, used to bring up the drop interface, has been moved to
  `AllihoopaUI.drop` to separate UI and non-UI parts. If you use the NPM
  distributed package, you now import `drop` from `allihoopa/ui` as such:

  ```javascript
  import {drop} from 'allihoopa/ui';
  ```

### Added

* Headless drop API, making it possible to implement your own drop user
  interface on top of the new primitives. Non-NPM users can refer to the
  `allihoopa-headless.min.js` for a small package without any UI code.

### Changes

* React and Radium turned into optional dependencies

## [0.3.0] — 2016-10-12

### Added

* Drop support

### Breaking changes

* Parameters to the `setup()` method were renamed

## [0.2.0] — 2016-09-22

### Added

* SDK configuration function
* User authentication popup support

## 0.1.0 — 2016-09-20

Empty release


[0.2.0]: https://github.com/allihoopa/allihoopa.js/compare/v0.1.0...v0.2.0
[0.3.0]: https://github.com/allihoopa/allihoopa.js/compare/v0.2.0...v0.3.0
[0.4.0]: https://github.com/allihoopa/allihoopa.js/compare/v0.3.0...v0.4.0
[0.4.1]: https://github.com/allihoopa/allihoopa.js/compare/v0.4.0...v0.4.1
[0.4.2]: https://github.com/allihoopa/allihoopa.js/compare/v0.4.1...v0.4.2
[1.0.0]: https://github.com/allihoopa/allihoopa.js/compare/v0.4.2...v1.0.0
[1.1.0]: https://github.com/allihoopa/allihoopa.js/compare/v1.0.0...v1.1.0
[1.2.0]: https://github.com/allihoopa/allihoopa.js/compare/v1.1.0...v1.2.0
[1.2.1]: https://github.com/allihoopa/allihoopa.js/compare/v1.2.0...v1.2.1
[1.2.2]: https://github.com/allihoopa/allihoopa.js/compare/v1.2.1...v1.2.2
