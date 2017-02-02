import {AudioAssetFormat, CreatedPiece, ImageAssetFormat, PieceInput} from './DropInterfaces';

import {graphQLQuery, ResultCallback} from '../graphql';
import {clampUnit} from '../utils/math';

export type SongAssetFormat = AudioAssetFormat | ImageAssetFormat;
export type SongAssetType = 'cover_image' | 'preview_audio' | 'mix_stem';

export function uploadResource(
    data: Blob,
    type: SongAssetType,
    format: SongAssetFormat,
    completionCallback: ResultCallback<string>,
    progressCallback: ProgressCallback,
) {
    const GET_URL_PROGRESS = 0.1;
    const UPLOAD_FILE_PROGRESS = 0.9;

    getUrl(type, format, (result) => {
        if (result.status === 'OK') {
            progressCallback(GET_URL_PROGRESS);
            const url = result.data;
            uploadFile(
                url,
                data,
                (result) => {
                    if (result.status === 'OK') {
                        completionCallback({ status: 'OK', data: url });
                    }
                    else {
                        completionCallback(result);
                    }
                },
                (progress: number) => progressCallback(
                    clampUnit(GET_URL_PROGRESS + progress * UPLOAD_FILE_PROGRESS),
                ),
            );
        }
        else {
            completionCallback(result);
        }
    });
}

export function getUrl(type: SongAssetType, format: SongAssetFormat, callback: ResultCallback<string>) {
    const query = `
        mutation ($format: SongAssetFormat!, $type: SongAssetType!) {
            uploadUrlForFormat(assetFormat: $format, assetType: $type) {
                url
            }
        }`;

    graphQLQuery<{uploadUrlForFormat: {url: string}}>(
        query,
        { type, format },
        (result) => {
            if (result.status === 'OK') {
                callback({ status: 'OK', data: result.data.uploadUrlForFormat.url });
            }
            else {
                callback(result);
            }
        },
    );
}

export type CompletionCallback = (successful: boolean) => void;
export type ProgressCallback = (progress: number) => void;

export function uploadFile(
    url: string,
    data: Blob,
    completionCallback: ResultCallback<null>,
    progressCallback: ProgressCallback,
) {
    if (!url) {
        throw new Error('No file url');
    }

    // If we send the Blob itself with XMLHttpRequest, the `Content-Type`
    // header will be set to the containing MIME type. However, we can't
    // sign our upload URLs for arbitrary content type, so we convert the
    // Blob here first to a raw ArrayBuffer, stripping the content type
    // in the process.
    //
    // This fixes an issue with Safari 9 where `setRequestHeader` throws
    // an exception for empty content types.
    const reader = new FileReader();
    reader.addEventListener('loadend', () => {
        if (reader.result instanceof ArrayBuffer) {
            const xhr = new XMLHttpRequest();
            xhr.open('PUT', url);

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    completionCallback({ status: 'OK', data: null });
                } else if (xhr.readyState === 4) {
                    completionCallback({
                        status: 'ERROR',
                        error: new Error('Could not upload file. Status = ' + xhr.status + ' ' + xhr.responseText) });
                }
            };

            xhr.upload.onprogress = function(e) {
                if (e.lengthComputable) {
                    progressCallback(clampUnit(e.loaded / e.total));
                }
            };

            xhr.send(reader.result);
        } else {
            completionCallback({
                status: 'ERROR',
                error: new Error('Could not convert file data to raw array buffer'),
            });
        }
    });

    reader.readAsArrayBuffer(data);
}

interface DropPieceResult {
    dropPiece: {
        piece: CreatedPiece,
    };
}

export function dropPiece(piece: PieceInput, callback: ResultCallback<CreatedPiece>) {
    const query = `
        mutation ($piece: PieceInput!) {
            dropPiece(piece: $piece) {
                piece {
                    url
                    title
                    coverImage(position: 10 withFallback: true) {
                        url
                    }
                }
            }
        }`;

    graphQLQuery<DropPieceResult>(query, { piece: piece }, (result) => {
        if (result.status === 'OK') {
            callback({ status: 'OK', data: result.data.dropPiece.piece });
        }
        else {
            callback(result);
        }
    });
}
