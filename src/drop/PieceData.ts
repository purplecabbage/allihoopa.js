export interface DropPieceData {
    stems: StemsData;
    presentation: PresentationData;
    attribution?: AttributionData;
    musicalMetadata: MusicalMetadata;
}

export type BlobCallback = (data: Blob | null, error: Error | null) => void;

export interface StemsData {
    mixStem: (completion: BlobCallback) => void;
}

export interface PresentationData {
    title: string;
    preview?: (completion: BlobCallback) => void;
    coverImage?: (completion: BlobCallback) => void;
}

export interface AttributionData {
    basedOnPieces: Array<string>;
}

export interface MusicalMetadata {
    lengthMicroseconds: number;
    tempo?: FixedTempoData;
    loop?: LoopMarkerData;
    timeSignature?: FixedTimeSignatureData;
}

export interface FixedTempoData {
    fixed: number;
}

export interface LoopMarkerData {
    startMicroseconds: number;
    endMicroseconds: number;
}

export interface FixedTimeSignatureData {
    fixed: TimeSignatureData;
}

export interface TimeSignatureData {
    upper: number;
    lower: number;
}

const ALLIHOOPA_SHORT_ID_REGEX = /^https:\/\/allihoopa.com\/s\/([^\/]+)$/;

export class DropPiece {
    stems: StemsData;
    presentation: PresentationData;
    attribution?: AttributionData;
    musicalMetadata: MusicalMetadata;

    constructor(data: DropPieceData) {
        this.stems = data.stems;
        this.presentation = data.presentation;
        this.attribution = data.attribution;
        this.musicalMetadata = data.musicalMetadata;

        const errors: any[] = [];
        this.validate(errors);

        if (errors.length) {
            throw new Error(`Invalid piece created: ${errors.join(', ')}`);
        }
    }

    private validate(errors: string[]) {
        this.validateStems(errors);
        this.validatePresentation(errors);
        this.validateAttribution(errors);
        this.validateMusicalMetadata(errors);
    }

    private validateStems(errors: string[]) {
        if (!this.stems) {
            errors.push('Missing `stems` field');
            return;
        }

        if (!this.stems.mixStem) {
            errors.push('Missing `mixStem` field on `stems`');
            return;
        }

        if (!(this.stems.mixStem instanceof Function)) {
            errors.push('`mixStem` field on `stems` must be a function');
        }
    }

    private validatePresentation(errors: string[]) {
        if (!this.presentation) {
            errors.push('Missing `presentation` field');
            return;
        }

        if (!this.presentation.title) {
            errors.push('Missing `title` field on `presentation`');
        }
        else if (!this.presentation.title.length) {
            errors.push('Field `title` field on `presentation` can not be empty');
        }
        else if (this.presentation.title.length > 50) {
            errors.push('Field `title` field on `presentation` can not be more than 50 characters');
        }

        if (this.presentation.coverImage && !(this.presentation.coverImage instanceof Function)) {
            errors.push('`coverImage` field on `presentation` must be a function');
        }

        if (this.presentation.preview && !(this.presentation.preview instanceof Function)) {
            errors.push('`preview` field on `presentation` must be a function');
        }
    }

    private validateAttribution(errors: string[]) {
        if (this.attribution) {
            const pieces = this.attribution.basedOnPieces;

            if (pieces === undefined) {
                errors.push('Missing field `basedOnPieces` on `attribution`');
                return;
            }

            if (!(pieces instanceof Array)) {
                errors.push('`basedOnPieces` field on `attribution` must be an array');
                return;
            }

            for (let i = 0; i < pieces.length; ++i) {
                if (!(typeof (pieces[i] as any) === 'string')) {
                    errors.push('`basedOnPieces` field on `attribution` must be an array of strings');
                    break;
                }

                if (ALLIHOOPA_SHORT_ID_REGEX.test(pieces[i])) {
                    pieces[i] = pieces[i].replace(ALLIHOOPA_SHORT_ID_REGEX, '$1');
                }
            }
        }
    }

    private validateMusicalMetadata(errors: string[]) {
        if (!this.musicalMetadata) {
            errors.push('Missing field `musicalMetadata`');
            return;
        }

        validateNumber(
            this.musicalMetadata.lengthMicroseconds,
            'field `lengthMicroseconds` of `musicalMetadata`',
            1, 1200000000,
            errors);

        if (this.musicalMetadata.tempo) {
            const tempo = this.musicalMetadata.tempo;
            validateNumber(
                tempo.fixed,
                'field `fixed` of `tempo` on `musicalMetadata`',
                1, 999.999,
                errors);
        }

        if (this.musicalMetadata.loop) {
            const loop = this.musicalMetadata.loop;

            validateNumber(
                loop.startMicroseconds,
                'field `startMicroseconds` of `loop` on `musicalMetadata`',
                0, this.musicalMetadata.lengthMicroseconds,
                errors);

            validateNumber(
                loop.endMicroseconds,
                'field `endMicroseconds` of `loop` on `musicalMetadata`',
                0, this.musicalMetadata.lengthMicroseconds,
                errors);

            if (isFinite(loop.startMicroseconds) && isFinite(loop.endMicroseconds) && loop.startMicroseconds >= loop.endMicroseconds) {
                errors.push('Field `loop` on `musicalMetadata`: the start must come before the end');
            }
        }

        if (this.musicalMetadata.timeSignature) {
            const ts = this.musicalMetadata.timeSignature;

            if (!ts.fixed) {
                errors.push('Field `fixed` of `timeSignature` on `musicalMetadata` must be set');
            }
            else {
                if ([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].indexOf(ts.fixed.upper) === -1) {
                    errors.push('Field `upper` of `fixed` of `timeSignature` on `musicalMetadata` must be an integer between 1 and 16');
                }
                if ([2, 4, 8, 16].indexOf(ts.fixed.lower) === -1) {
                    errors.push('Field `lower` of `fixed` of `timeSignature` on `musicalMetadata` must be either 2, 4, 8, or 16');
                }
            }
        }
    }
}

function validateNumber(value: any, msg: string, min: number, max: number, errors: string[]) {
    if (value === undefined) {
        errors.push(`Missing ${msg}`);
    }
    else if (!isFinite(value)) {
        errors.push(`${msg} must be a number`);
    }
    else if (value > max) {
        errors.push(`${msg} too high: it must be lower than ${max}`);
    }
    else if (value < min) {
        errors.push(`${msg} too low: it must be higher than ${min}`);
    }
}
