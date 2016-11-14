"use strict";
var mod = require('./lib/src/index');

for (var key in mod) {
    if (mod.hasOwnProperty(key)) {
        exports[key] = mod[key];
    }
}
