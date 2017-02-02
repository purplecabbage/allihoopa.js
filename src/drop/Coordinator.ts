import {Result} from '../graphql';

import {rotateImageFromMetadata} from '../utils/image';
import {clampUnit} from '../utils/math';

import * as DropAPI from './DropAPI';
import {CreatedPiece, PieceInput} from './DropInterfaces';
import {DropPiece} from './PieceData';

const FETCH_PROGRESS_PART = 0.3;
const UPLOAD_PROGRESS_PART = 0.7;

const ALL_UPLOADS_PROGRESS_PART = 0.7;
const CREATE_PIECE_PROGRESS_PART = 0.2;
const COMMIT_EDITOR_PROGRESS_PART = 0.1;

export type AudioAssetType = 'ogg' | 'wav';
export type ImageAssetType = 'png';

export type AssetState<T>
    = { state: 'NO_ASSET' }
    | { state: 'ERROR', error: Error }
    | { state: 'WAITING' }
    | { state: 'DONE', url: string, asset_type: T };

export interface EditInfoState {
    readonly title: string;
    readonly description: string;
    readonly listed: boolean;
    readonly coverImageDataURL: string | null;
    readonly coverImageBinary: Blob | null;
}

export type DropCompletionCallback = (piece: CreatedPiece | null, error: Error | null) => void;

export interface CoordinatorOptions {
    readonly piece: DropPiece;
    readonly onDropCompleted?: DropCompletionCallback;
    readonly onInitialCoverImageDidArrive?: ((data: Blob) => void);
    readonly onProgress?: DropAPI.ProgressCallback;
}

export class Coordinator {
    private piece: DropPiece;
    private onDropCompleted?: DropCompletionCallback;
    private onProgress?: DropAPI.ProgressCallback;
    private onInitialCoverImageDidArrive?: ((data: Blob) => void);

    private isCanceled: boolean = false;
    private isUploading: boolean = false;
    private committedEditorState?: EditInfoState;

    private mixStemState: AssetState<AudioAssetType> = { state: 'WAITING' };
    private mixStemProgress: number = 0;
    private previewAudioState: AssetState<AudioAssetType> = { state: 'WAITING' };
    private previewAudioProgress: number = 0;
    private coverImageState: AssetState<ImageAssetType> = { state: 'WAITING' };
    private coverImageProgress: number = 0;

    private initialCoverImageState?: Result<Blob | null>;
    private isUploadingCoverImage: boolean = false;

    private createPieceResult?: Result<CreatedPiece>;

    constructor(options: CoordinatorOptions) {
        this.piece = options.piece;
        this.onDropCompleted = options.onDropCompleted;
        this.onProgress = options.onProgress;
        this.onInitialCoverImageDidArrive = options.onInitialCoverImageDidArrive;

        this.fetchMixStem();
        this.fetchPreviewAudio();
        this.fetchInitialCoverImage();
    }

    commitEditor(state: EditInfoState) {
        this.committedEditorState = state;
        this.didUpdateState();
    }

    commitEditorDefaults() {
        this.commitEditor({
            coverImageBinary: (this.initialCoverImageState && this.initialCoverImageState.status === 'OK')
                ? this.initialCoverImageState.data : null,
            coverImageDataURL: null,
            description: '',
            listed: false,
            title: this.piece.presentation.title,
        });
    }

    cancel() {
        this.isCanceled = true;
    }

    private fetchMixStem() {
        this.piece.stems.mixStem(
            (audio, error) => this.mixStemDidArrive(audio, error));
    }

    private mixStemDidArrive(audio: Blob | null, error: Error | null) {
        if (this.isCanceled) {
            return;
        }

        if (audio) {
            this.mixStemProgress = FETCH_PROGRESS_PART;
            this.didUpdateProgress();

            DropAPI.uploadResource(
                audio,
                result => {
                    if (this.isCanceled) {
                        return;
                    }

                    if (result.status === 'OK') {
                        this.mixStemState = {
                            state: 'DONE',
                            url: result.data,
                            asset_type: mimeToAudioAssetType(audio.type),
                        };

                        this.mixStemProgress = 1;
                        this.didUpdateProgress();
                    }
                    else {
                        this.mixStemState = { state: 'ERROR', error: result.error, };
                    }

                    this.didUpdateState();
                },
                progress => {
                    this.mixStemProgress = clampUnit(FETCH_PROGRESS_PART + UPLOAD_PROGRESS_PART * progress);
                    this.didUpdateProgress();
                });
        }
        else if (error) {
            this.mixStemState = { state: 'ERROR', error: error };
            this.didUpdateState();
        }
        else {
            console.error('[Allihoopa SDK] Incorrect usage: neither a mix stem nor an error was produced');
            this.mixStemState = { state: 'ERROR', error: new Error('Invalid SDK usage') };
            this.didUpdateState();
        }
    }

    private fetchPreviewAudio() {
        if (!this.piece.presentation.preview) {
            this.previewAudioState = { state: 'NO_ASSET' };
            this.didUpdateState();
        }
        else {
            this.piece.presentation.preview(
                (data, error) => this.previewAudioDidArrive(data, error));
        }
    }

    private previewAudioDidArrive(audio: Blob | null, error: Error | null) {
        if (this.isCanceled) {
            return;
        }

        if (audio) {
            this.previewAudioProgress = FETCH_PROGRESS_PART;
            this.didUpdateProgress();

            DropAPI.uploadResource(
                audio,
                result => {
                    if (this.isCanceled) {
                        return;
                    }

                    if (result.status === 'OK') {
                        this.previewAudioState = {
                            state: 'DONE',
                            url: result.data,
                            asset_type: mimeToAudioAssetType(audio.type),
                        };

                        this.previewAudioProgress = 1;
                        this.didUpdateProgress();
                    }
                    else {
                        this.previewAudioState = { state: 'ERROR', error: result.error };
                    }
                    this.didUpdateState();
                },
                progress => {
                    this.previewAudioProgress = clampUnit(FETCH_PROGRESS_PART + UPLOAD_PROGRESS_PART * progress);
                    this.didUpdateProgress();
                });
        }
        else if (error) {
            this.previewAudioState = { state: 'ERROR', error: error };
            this.didUpdateState();
        }
        else {
            this.previewAudioState = { state: 'NO_ASSET' };
            this.didUpdateState();
        }
    }

    private fetchInitialCoverImage() {
        if (!this.piece.presentation.coverImage) {
            this.initialCoverImageState = { status: 'OK', data: null };
            this.didUpdateState();
        }
        else {
            this.piece.presentation.coverImage((data, error) => {
                if (data) {
                    rotateImageFromMetadata(data, image => {
                        this.initialCoverImageDidArrive(image, error);
                    });
                }
                else {
                    this.initialCoverImageDidArrive(data, error);
                }
            });
        }
    }

    private initialCoverImageDidArrive(image: Blob | null, error: Error | null) {
        if (this.isCanceled) {
            return;
        }

        if (error) {
            this.initialCoverImageState = { status: 'ERROR', error: error };
        }
        else {
            this.initialCoverImageState = { status: 'OK', data: image };

            if (image && this.onInitialCoverImageDidArrive) {
                this.onInitialCoverImageDidArrive(image);
            }
        }

        this.didUpdateState();
    }

    private uploadCoverImage() {
        let data = (this.initialCoverImageState && this.initialCoverImageState.status === 'OK')
            ? this.initialCoverImageState.data : null;

        if (this.committedEditorState && this.committedEditorState.coverImageBinary) {
            data = this.committedEditorState.coverImageBinary;
        }

        if (data) {
            let assetType = mimeToImageAssetType(data.type);

            this.coverImageProgress = FETCH_PROGRESS_PART;
            this.didUpdateProgress();

            DropAPI.uploadResource(
                data,
                result => {
                    if (this.isCanceled) {
                        return;
                    }

                    if (result.status === 'OK') {
                        this.coverImageState = {
                            state: 'DONE',
                            url: result.data,
                            asset_type: assetType,
                        };

                        this.coverImageProgress = 1;
                        this.didUpdateProgress();
                    }
                    else {
                        this.coverImageState = { state: 'ERROR', error: result.error };
                    }

                    this.didUpdateState();
                },
                progress => {
                    this.coverImageProgress = clampUnit(FETCH_PROGRESS_PART * UPLOAD_PROGRESS_PART * progress);
                    this.didUpdateProgress();
                });
        }
        else {
            this.coverImageState = { state: 'NO_ASSET' };
            this.didUpdateState();
        }
    }

    private createPiece() {
        if (this.mixStemState.state !== 'DONE') {
            throw new Error('[Allihoopa SDK] Internal error: can not create piece without mix stem');
        }

        if (!this.committedEditorState) {
            throw new Error('[Allihoopa SDK] Internal error: can not create piece without editor state');
        }

        const mixStem = this.mixStemState;
        const previewAudio = this.previewAudioState.state === 'DONE' ? this.previewAudioState : null;
        const coverImage = this.coverImageState.state === 'DONE' ? this.coverImageState : null;
        const pieceInfo = this.committedEditorState;

        const loopMarkers = this.piece.musicalMetadata.loop;
        const tonality = this.piece.musicalMetadata.tonality;

        const tonalityData = tonality && tonality.mode === 'TONAL'
            ? { scale: tonality.scale, root: tonality.root }
            : undefined;

        const pieceInput: PieceInput = {
            attribution: this.piece.attribution,
            musicalMetadata: {
                lengthUs: this.piece.musicalMetadata.lengthMicroseconds,
                loop: loopMarkers && {
                    startUs: loopMarkers.startMicroseconds,
                    endUs: loopMarkers.endMicroseconds,
                },
                tempo: this.piece.musicalMetadata.tempo,
                timeSignature: this.piece.musicalMetadata.timeSignature,
                tonality: tonality ? {
                    mode: tonality.mode,
                    data: tonalityData,
                } : undefined,
            },
            presentation: {
                coverImage: coverImage && { [coverImage.asset_type]: coverImage.url },
                preview: previewAudio && { [previewAudio.asset_type]: previewAudio.url },
                title: pieceInfo.title,
                description: pieceInfo.description,
                isListed: pieceInfo.listed,
            },
            stems: {
                mixStem: { [mixStem.asset_type]: mixStem.url },
            },
        };

        DropAPI.dropPiece(pieceInput, result => {
            this.isUploading = false;
            this.createPieceResult = result;
            this.didUpdateProgress();
            this.didUpdateState();
        });
    }

    private didUpdateState() {
        if (this.isCanceled) {
            return;
        }

        if (this.committedEditorState && this.initialCoverImageState && !this.isUploadingCoverImage) {
            this.isUploadingCoverImage = true;
            this.uploadCoverImage();
        }

        const allUploadsComplete = (
            this.mixStemState.state === 'DONE' &&
            (this.coverImageState.state === 'DONE' || this.coverImageState.state === 'NO_ASSET') &&
            (this.previewAudioState.state === 'DONE' || this.previewAudioState.state === 'NO_ASSET')
        );

        if (allUploadsComplete && !this.isUploading && !this.createPieceResult) {
            this.isUploading = true;
            this.createPiece();
        }

        if (allUploadsComplete && !this.isUploading && this.createPieceResult) {
            if (this.onDropCompleted) {
                this.onDropCompleted(
                    this.createPieceResult.status === 'OK' ? this.createPieceResult.data : null,
                    this.createPieceResult.status === 'ERROR' ? this.createPieceResult.error : null,
                );
            }
        }
    }

    private didUpdateProgress() {
        if (!this.onProgress) {
            return;
        }

        let progress = 0;

        if (this.committedEditorState) {
            progress += COMMIT_EDITOR_PROGRESS_PART;
        }

        if (this.createPieceResult) {
            progress += CREATE_PIECE_PROGRESS_PART;
        }

        let uploads = 1;
        let uploadProgress = this.mixStemProgress;

        if (this.coverImageState.state !== 'NO_ASSET') {
            uploads += 1;
            uploadProgress += this.coverImageProgress;
        }

        if (this.previewAudioState.state !== 'NO_ASSET') {
            uploads += 1;
            uploadProgress += this.previewAudioProgress;
        }

        progress += (uploadProgress / uploads) * ALL_UPLOADS_PROGRESS_PART;

        this.onProgress(clampUnit(progress));
    }
};

function mimeToAudioAssetType(mime: string): AudioAssetType {
    if (mime === 'audio/x-wav' || mime === 'audio/wav') {
        return 'wav';
    }
    else if (mime === 'audio/x-ogg' || mime === 'audio/ogg') {
        return 'ogg';
    }

    throw new Error(`Unknown audio MIME type: ${mime}, we only support Ogg/Vorbis and WAVE`);
}

function mimeToImageAssetType(mime: string): ImageAssetType {
    if (mime === 'image/png') {
        return 'png';
    }

    throw new Error(`Unknown image MIME type: ${mime}, we only support PNG`);
}
