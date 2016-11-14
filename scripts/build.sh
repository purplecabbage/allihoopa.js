#!/usr/bin/env bash

set -eu

if [ ! -f package.json ]; then
    echo 'This must be run from the source root of the project'
    exit 1
fi

if [ ! -d node_modules ]; then
    exit 'NPM dependencies must have been installed'
    exit 1
fi

WEBPACK_EXTRA=

if [ -n "${TRAVIS_TAG+set}" ]; then
    if [ "${TRAVIS_TAG?}" != "" ]; then
        echo "Tagging release for ${TRAVIS_TAG}"
        echo
        echo "Naming release ${TRAVIS_TAG/v/}"
        WEBPACK_EXTRA=--versionTag=${TRAVIS_TAG/v/}
    fi
fi

WEBPACK=./node_modules/.bin/webpack

./scripts/clean.sh

./node_modules/.bin/typings install
./node_modules/.bin/tsc --declaration

$WEBPACK $WEBPACK_EXTRA
$WEBPACK --production $WEBPACK_EXTRA
$WEBPACK --externalReact $WEBPACK_EXTRA
$WEBPACK --externalReact --production $WEBPACK_EXTRA
$WEBPACK --headless $WEBPACK_EXTRA
$WEBPACK --headless --production $WEBPACK_EXTRA
