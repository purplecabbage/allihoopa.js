import * as Allihoopa from 'allihoopa';
import * as AllihoopaUI from 'allihoopa/ui';

declare const ALLIHOOPA_APP_IDENTIFIER: string;
declare const ALLIHOOPA_API_KEY: string;

const authButton = document.querySelector('#js-open-auth');
const dropButton = document.querySelector('#js-open-drop');
const dropWithoutUIButton = document.querySelector('#js-drop-without-ui');
const dropButtonAttachment = document.querySelector('#js-drop-attachment');
const coverImageInput = document.querySelector('#js-cover-image-input') as HTMLInputElement;
console.assert(!!authButton);
console.assert(!!dropButton);
console.assert(!!dropWithoutUIButton);
console.assert(!!dropButtonAttachment);
console.assert(!!coverImageInput);

if (!authButton) { throw new Error('Auth button must exist'); }
if (!dropButton) { throw new Error('Drop button must exist'); }
if (!dropWithoutUIButton) { throw new Error('Drop without UI button'); }
if (!dropButtonAttachment) { throw new Error('Drop attachment button must exist'); }

Allihoopa.setup({
    app: ALLIHOOPA_APP_IDENTIFIER,
    apiKey: ALLIHOOPA_API_KEY,
});

authButton.addEventListener('click', () => {
    Allihoopa.authenticate((success) => {
        const p = document.createElement('pre');
        p.innerText = JSON.stringify(success ? 'Successful' : 'Cancelled');

        document.body.appendChild(p);
    });
});

dropButton.addEventListener('click', () => {
    AllihoopaUI.drop(makeDropPiece(), piece => {
        const p = document.createElement('pre');
        p.innerText = JSON.stringify(piece ? 'Drop successful' : 'Drop cancelled');

        document.body.appendChild(p);
    });
});

dropWithoutUIButton.addEventListener('click', () => {
    Allihoopa.drop(
        makeDropPiece(),
        piece => {
            if (piece) {
                const a = document.createElement('a');
                a.innerText = piece.title;
                a.setAttribute('href', piece.url);
                a.setAttribute('style', 'display: block');
                a.setAttribute('target', '_blank');

                document.body.appendChild(a);
            }
            else {
                const p = document.createElement('pre');
                p.innerText = 'Drop failed :(';

                document.body.appendChild(p);
            }
        },
        progress => {
            const p = document.createElement('pre');
            p.innerText = `Progress ${progress}`;

            document.body.appendChild(p);
        },
    );
});

dropButtonAttachment.addEventListener('click', () => {
    AllihoopaUI.drop(makeDropPieceWithAttachment(), piece => {
        const p = document.createElement('pre');
        p.innerText = JSON.stringify(piece ? 'Drop successful' : 'Drop cancelled');

        document.body.appendChild(p);
    });
});

function makeDropPiece(): Allihoopa.DropPiece {
    const attribution = document.querySelector('#js-attribution') as HTMLTextAreaElement;
    console.assert(!!attribution);

    return new Allihoopa.DropPiece({
        stems: {
            mixStem: (completion: (data: Blob | null, error: Error | null) => void) => {
                getFileAsBytes(window.location.origin + '/drop.wav', completion);
            },
        },
        presentation: {
            title: 'A test piece',
            coverImage: (completion: (data: Blob | null, error: Error | null) => void) => {
                if (coverImageInput.files) {
                    completion(coverImageInput.files[0], null);
                }
            },
        },
        musicalMetadata: {
            lengthMicroseconds: 10000000,
            tempo: {
                fixed: 121,
            },
            loop: {
                startMicroseconds: 0,
                endMicroseconds: 1000,
            },
            timeSignature: {
                fixed: {
                    upper: 4,
                    lower: 4,
                },
            },
            tonality: {
                mode: 'TONAL',
                scale: Allihoopa.getMajorScale(2),
                root: 2,
            },
        },
        attribution: {
            basedOnPieces: attribution.value.trim() ? attribution.value.trim().split('\n') : [],
        },
    });
}

function makeDropPieceWithAttachment(): Allihoopa.DropPiece {
    const attribution = document.querySelector('#js-attribution') as HTMLTextAreaElement;
    console.assert(!!attribution);

    return new Allihoopa.DropPiece({
        stems: {
            mixStem: (completion: (data: Blob | null, error: Error | null) => void) => {
                getFileAsBytes(window.location.origin + '/drop.wav', completion);
            },
        },
        presentation: {
            title: 'A test piece',
            coverImage: (completion: (data: Blob | null, error: Error | null) => void) => {
                if (coverImageInput.files) {
                    completion(coverImageInput.files[0], null);
                }
            },
        },
        musicalMetadata: {
            lengthMicroseconds: 10000000,
            tempo: {
                fixed: 121,
            },
            loop: {
                startMicroseconds: 0,
                endMicroseconds: 1000,
            },
            timeSignature: {
                fixed: {
                    upper: 4,
                    lower: 4,
                },
            },
            tonality: {
                mode: 'TONAL',
                scale: Allihoopa.getMajorScale(2),
                root: 2,
            },
        },
        attribution: {
            basedOnPieces: attribution.value.trim() ? attribution.value.trim().split('\n') : [],
        },
        attachment: {
            mimeType: 'application/figure',
            data: (completion: (data: Blob | null, error: Error | null) => void) => {
                getFileAsBytes(window.location.origin + '/figure_song.xml', completion);
            },
        },
    });
}

function getFileAsBytes(url: string, callback: (file: Blob | null, error: Error | null) => void) {
    if (url.length > 0) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.onload = () => {
            if (xhr.status === 200) {
                const buf: Blob = xhr.response;

                if (!buf || buf.size <= 0) {
                    callback(null, new Error('Could not load file.'));
                }
                else {
                    callback(buf, null);
                }
            } else {
                callback(null, new Error('fetch error'));
            }
        };
        xhr.send();
    }
}
