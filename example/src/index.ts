import * as Allihoopa from 'allihoopa';
import * as AllihoopaUI from 'allihoopa/ui';

declare const ALLIHOOPA_APP_IDENTIFIER: string;
declare const ALLIHOOPA_API_KEY: string;

const authButton = document.querySelector('#js-open-auth');
const dropButton = document.querySelector('#js-open-drop');
console.assert(!!authButton);
console.assert(!!dropButton);

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
    const piece = new Allihoopa.DropPiece({
        stems: {
            mixStem: (completion: (data: Blob | null, error: Error | null) => void) => {
                getFileAsBytes(window.location.origin + '/drop.wav', completion);
            },
        },
        presentation: {
            title: 'A test piece',
            coverImage: () => {

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
        },
        attribution: {
            basedOnPieces: [],
        },
    });

    AllihoopaUI.drop(piece, (success) => {
        const p = document.createElement('pre');
        p.innerText = JSON.stringify(success ? 'Drop successful' : 'Drop cancelled');

        document.body.appendChild(p);
    });
});


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
