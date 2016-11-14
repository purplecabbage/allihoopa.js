import {Result} from '../graphql';

import * as DropAPI from './DropAPI';
import {CreatedPiece, PieceInput} from './DropInterfaces';
import {DropPiece} from './PieceData';

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
    readonly onDropCompleted: DropCompletionCallback | null;
    readonly onInitialCoverImageDidArrive: ((data: Blob) => void) | null;
}

export class Coordinator {
    private piece: DropPiece;
    private onDropCompleted: DropCompletionCallback | null;

    private isCanceled: boolean = false;
    private isUploading: boolean = false;
    private committedEditorState: EditInfoState | null = null;

    private mixStemState: AssetState<AudioAssetType> = { state: 'WAITING' };
    private previewAudioState: AssetState<AudioAssetType> = { state: 'WAITING' };
    private coverImageState: AssetState<ImageAssetType> = { state: 'WAITING' };

    private initialCoverImageState: Result<Blob | null> | null = null;

    private createPieceResult: Result<CreatedPiece> | null = null;

    constructor(options: CoordinatorOptions) {
        this.piece = options.piece;
        this.onDropCompleted = options.onDropCompleted;

        this.fetchMixStem();
        this.fetchPreviewAudio();
        this.fetchInitialCoverImage();
    }

    commitEditor(state: EditInfoState) {
        this.committedEditorState = state;
        this.uploadCoverImage(state.coverImageBinary);
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
                    }
                    else {
                        this.mixStemState = { state: 'ERROR', error: result.error, };
                    }

                    this.didUpdateState();
                },
                progress => { });
        }
        else if (error) {
            this.mixStemState = { state: 'ERROR', error: error };
            this.didUpdateState();
        }
        else {
            console.error('[Allihoopa SDK] Incorrect usage: neither a mix stem nor an error was produced');
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
                    }
                    else {
                        this.previewAudioState = { state: 'ERROR', error: result.error };
                    }
                    this.didUpdateState();
                },
                progress => { });
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
            this.piece.presentation.coverImage(
                (data, error) => this.initialCoverImageDidArrive(data, error));
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
        }

        this.didUpdateState();
    }

    private uploadCoverImage(data: Blob | null) {
        if (data) {
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
                            asset_type: mimeToImageAssetType(data.type),
                        };
                    }
                    else {
                        this.coverImageState = { state: 'ERROR', error: result.error };
                    }

                    this.didUpdateState();
                },
                progress => { });
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
            this.didUpdateState();
        });
    }

    private didUpdateState() {
        if (this.isCanceled) {
            return;
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
};

function mimeToAudioAssetType(mime: string): AudioAssetType {
    if (mime === 'audio/x-wav') {
        return 'wav';
    }
    else if (mime === 'audio/x-ogg') {
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
