// API data
export type AudioAssetFormat = 'ogg' | 'wav';
export type ImageAssetFormat = 'png';

export interface CreatedPiece {
    url: string;
    title: string;
    coverImage: { url: string };
}

export interface PieceInput {
    stems: StemsInput;
    presentation: PresentationDataInput;
    attribution?: AttributionDataInput;
    musicalMetadata: MusicalMetadataInput;
    attachment?: AttachmentResourceInput;
}

export interface AudioResourceInput {
    ogg?: string;
    wav?: string;
}

export interface ImageResourceInput {
    png?: string;
}

export interface StemsInput {
    mixStem: AudioResourceInput;
}

export interface PresentationDataInput {
    title: string;
    description: string;
    isListed: boolean;
    preview: AudioResourceInput | null;
    coverImage: ImageResourceInput | null;
}

export interface AttributionDataInput {
    basedOnPieces: Array<string>;
}

export interface MusicalMetadataInput {
    lengthUs: number;
    tempo?: FixedTempoInput;
    loop?: LoopInput;
    timeSignature?: FixedTimeSignatureInput;
    tonality?: TonalityInput;
}

export interface FixedTempoInput {
    fixed: number;
}

export interface LoopInput {
    startUs: number;
    endUs: number;
}

export interface FixedTimeSignatureInput {
    fixed: TimeSignatureInput;
}

export interface TimeSignatureInput {
    upper: number;
    lower: number;
}

export interface TonalityInput {
    mode: 'UNKNOWN' | 'ATONAL' | 'TONAL';
    data?: TonalityDataInput;
}

export interface TonalityDataInput {
    scale: boolean[];
    root: number;
}

export interface AttachmentResourceInput {
    mimeType: string;
    url: string;
}
