// This file is the entry point for Webpack, and is used to set up the global
// Allihoopa object when the SDK is loaded through <script> tags from CDN.

if (window.Allihoopa) {
    console.warn('[Allihoopa SDK] window.Allihoopa already defined');
}

window.Allihoopa = require('./index.ts');
