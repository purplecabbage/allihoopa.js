Allihoopa.js
============

[![Travis](https://travis-ci.org/allihoopa/allihoopa.js.svg?branch=master)](https://travis-ci.org/allihoopa/allihoopa.js)
[![npm](https://img.shields.io/npm/v/allihoopa.svg)](https://www.npmjs.com/package/allihoopa)

----

> Javascript SDK to interface with [Allihoopa].

# Installation

You can use this SDK in three different ways. If you use e.g. Webpack or
Browserify, you can use the NPM module directly. We export [TypeScript] type
definitions, if you use it this way.

We use [Yarn](https://yarnpkg.com) instead of npm throughout the SDK to handle depencendies. You can of course still use `npm` to install the SDK.

```bash
yarn add allihoopa
```

If you have no build system but use React on your site, you can include the
library from our CDN. React 15.0.0 or later is required.

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.3.2/react.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.3.2/react-dom.min.js"></script>

<script src="https://ahcdn.se/sdk-dist/allihoopa-1.1.0.min.js"></script>
```

We also build a standalone version that wraps all dependencies required by our
SDK:

```html
<script src="https://ahcdn.se/sdk-dist/allihoopa-standalone-1.1.0.min.js"></script>
```


## Development setup

See the [example] folder for how to set up an interactive development
environment.


[Allihoopa]: https://allihoopa.com
[TypeScript]: https://www.typescriptlang.org
[example]: example/



# API Documentation

## Setting up the SDK

```javascript
var Allihoopa = require('allihoopa'); // If you're using NPM

Allihoopa.setup({
    app: '<application identifier>',
    apiKey: '<API  key>',
});
```

This must be called before any other API calls can be made. Provide the
application identifier and API key you got when you registered your app. If
you're interested in getting your app up and running with Allihoopa, contact us
at [developer@allihoopa.com](mailto:developer@allihoopa.com).


## Authenticating users

```javascript
Allihoopa.authenticate(function (successful) {
    if (successful) {
        // The user is now logged in
    } else {
        // The user canceled log in/sign up
    }
});
```

This opens a login/signup dialog where the user can authenticate with Allihoopa.

If the user is already logged in on Allihoopa, the dialog will immediately close
itself and the callback called with a successful response.

The callback will also be executed if the user cancels the log in flow, by e.g.
closing the window.


## Dropping pieces

```javascript
var piece = new Allihoopa.DropPiece({
    presentation: {
        title: 'Default title', // The default title of the piece
    },
    musicalMetadata: {
        lengthMicroseconds: 12000000, // Length of the piece, in microseconds
    },
    stems: {
        mixStem: function (completion) {
            // Render or download your audio and call completion with a Blob
            // object containing the audio data in Wave or Ogg formats.
            if (hasData) {
                completion(myData);
            } else {
                // If something fails, provide an Error instance as the second
                // argument:
                completion(null, new Error('Audio rendering failure'));
            },
        },
    },
});

// Include the UI parts of the SDK if you're using NPM. This also requires
// the package's optionalDependencies to be installed.
var AllihoopaUI = require('allihoopa/ui');

AllihoopaUI.drop(piece, function (createdPiece, error) {
    if (createdPiece) {
        // The user successfully dropped the piece. You can get the URL through
        // `createdPiece.url`.
    } else {
        // The user closed the dialog without dropping, either by an error
        // or by not going through the steps.
    }
});
```

This creates a modal drop dialog on the current page. The function takes a
`DropPiece` instance and a completion callback that will be called when the user
closes the dialog. The above example contains the minimal amount of data
required to drop a piece - a default title, the audio data length, and the audio
data itself.

`DropPiece` will perform validation and raise an exception if the data is
invalid - such as loop markers being inverted or the length outside of
reasonable limits. These are *usually* programmer errors - not runtime errors
that can be handled in a meaningful way.

If your application knows about it, it can supply a lot more metadata to
`DropPiece` than described above. Here's a complete example showing all
properties you can set:

```javascript
var piece = new Allihoopa.DropPiece({
    stems: {
        mixStem: function (completion/*(mixStemBlob, error)*/) {
            // The "mix stem" is the audio data that should be used to place
            // the piece on a timeline. Call the completion handler with a Blob
            // instance when the data is available.
            //
            // The mix stem is mandatory.
        },
    },
    presentation: {
        title: 'Default title',
        coverImage: function (completion/*(coverImageBlob, error)*/) {
            // You can supply a default cover image that the user can upload,
            // or change. Call completion with a Blob containing a PNG image
            // of size 640x640, or null if none is available.
        },
        preview: function (completion/*(previewAudioBlob, error)*/) {
            // If the audio to be placed on a timeline is different from what
            // users should listen to, provide a "preview" audio Blob here.
            //
            // For example, if you're providing a short loop you can supply only
            // the loop data in a lossless format as the mix stem, and then a
            // longer track containing a few loops with fade in/out in a lossy
            // format in the preview audio.
            //
            // The preview audio is what's going to be played on the website.
            //
            // If no preview audio is provided, the mix stem will be used
            // instead.
        }
    },
    musicalMetadata: {
        lengthMicroseconds: 10000000, // Mandatory
        // If the tempo of the piece is available and fixed, provide a tempo
        // object for other applications to consume.
        tempo: {
            fixed: 121, // Allowed tempo range 1 - 999.999 BPM
        },
        // If the piece is a loop, provide the loop markers here. Both start
        // and end markers are required if the `loop` field is present.
        //
        // These refer to microsecond positions inside the mix stem audio data.
        loop: {
            startMicroseconds: 0,
            endMicroseconds: 1000,
        },
        // If the time signature is available and fixed, provide the following
        // object:
        timeSignature: {
            fixed: {
                upper: 4, // Allowed values are integers from 1 to 16
                lower: 4, // Allowed values are 2, 4, 8, 16
            },
        },
        // If the tonality is known and defined for the piece, provide the
        // following object:
        tonality: {
            mode: 'TONAL', // Other valid values are 'UNKNOWN' and 'ATONAL'

            // C Major scale. Omit scale if you're using an unknown or atonal
            // mode above.
            //
            // A scale is an array of twelve booleans, indicating which pitch
            // classes are included in the tonality.
            scale: Allihoopa.getMajorScale(0),

            // The root the tonality, indexed in scale. Omit root if you're
            // using an unknown or atonal mode above.
            //
            // The "root:th" index must be set in the scale array. For example,
            // setting this to 9 for a C Major scale will define the tonality
            // to be A minor.
            //
            // On allihoopa.com, we will only use the "scale" value to determine
            // which name to show, so a piece in A minor would still show up
            // as the key of C.
            root: 0,
        }
    },
    attribution: {
        // If this piece is based on other pieces, provide a list of the IDs
        // of those pieces here. You can also provide URLs to pieces on
        // Allihoopa, e.g. `https://allihoopa.com/s/VbUpAmUG`.
        basedOnPieces: [],
    },
    // You can supply an application specific attachment along the piece
    // that will be stored in Allihoopa.
    attachment: {
        // Pre-registered MIME type of the attachment. If you need one, 
        // ask it to be registered at developer@allihoopa.com
        mimeType: 'application/figure',
        data: function (completion/*(attachmentBlob, error)*/) {
            // Callback to provide the actual attachment
        },
    },
});
```

For more inoframtion on the tonality representation, read the more detailed
section in our [iOS SDK
documentation](https://github.com/allihoopa/Allihoopa-iOS#some-notes-on-tonality).


## Custom drop flow / usage without user interface

If your application already provides a user interface for sharing music, where
users can set titles and cover images, you can use our headless API to get a
more streamlined integration into your app.

If you're not using NPM to include our SDK, you can refer to the headless
variant on our CDN for a smaller download:

```html
<script src="https://ahcdn.se/sdk-dist/allihoopa-headless-1.1.0.min.js"></script>
```

To drop, use the `Allihoopa.drop` method. It works similar to `AllihoopaUI.drop`
but also provides an optional progress callback:

```javascript
Allihoopa.drop(
    piece,
    function (createdPiece, error) {
        // You can get a URL to the created piece from `createdPiece.url`
    },
    function (progress) {
        // Progress ranges from 0 to 1 and is an approximate number of how
        // much data is uploaded.
    });
```

The provided `piece` argument is an instance of `Allihoopa.DropPiece`, described
above.