Change log
==========

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
