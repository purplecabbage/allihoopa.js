import {
    BlobCallback,
    DropPiece,
    DropPieceData,
} from '../src/drop/PieceData';
import {getMajorScale} from '../src/piece/tonality';

describe('DropPiece validation', () => {
    it('validates the minimal metadata', () => {
        const md = minimalValidMetadata();
        const p = new DropPiece(md);
        expect(p.attachment).toEqual(md.attachment);
        expect(p.attribution).toEqual(md.attribution);
        expect(p.musicalMetadata).toEqual(md.musicalMetadata);
        expect(p.presentation).toEqual(md.presentation);
        expect(p.stems).toEqual(md.stems);
    });

    describe('piece length', () => {
        it('accepts exactly 1 microsecond pieces', () => {
            const md = minimalValidMetadata();
            md.musicalMetadata.lengthMicroseconds = 1;

            const p = new DropPiece(md);
            expect(p.musicalMetadata).toEqual(md.musicalMetadata);
        });

        it('accepts exactly 20 minute pieces', () => {
            const md = minimalValidMetadata();
            md.musicalMetadata.lengthMicroseconds = 1200000000;

            const p = new DropPiece(md);
            expect(p.musicalMetadata).toEqual(md.musicalMetadata);
        });

        it('rejects zero length', () => {
            const md = minimalValidMetadata();
            md.musicalMetadata.lengthMicroseconds = 0;
            expect(() => new DropPiece(md)).toThrowError(/lengthMicroseconds/);
        });

        it('rejects negative length', () => {
            const md = minimalValidMetadata();
            md.musicalMetadata.lengthMicroseconds = -50000;
            expect(() => new DropPiece(md)).toThrowError(/lengthMicroseconds/);
        });

        it('rejects missing length', () => {
            const md = minimalValidMetadata();
            delete md.musicalMetadata.lengthMicroseconds;
            expect(() => new DropPiece(md)).toThrowError(/lengthMicroseconds/);
        });

        it('rejects longer than 20 minute pieces', () => {
            const md = minimalValidMetadata();
            md.musicalMetadata.lengthMicroseconds = 1200000001;
            expect(() => new DropPiece(md)).toThrowError(/lengthMicroseconds/);
        });

        it('rejects invalid type of length', () => {
            const md = minimalValidMetadata() as any;
            md.musicalMetadata.lengthMicroseconds = 'banana';
            expect(() => new DropPiece(md)).toThrowError(/lengthMicroseconds/);
        });
    });

    describe('tempo', () => {
        it('accepts valid tempo', () => {
            const md = minimalValidMetadata();
            md.musicalMetadata.tempo = { fixed: 128 };

            const p = new DropPiece(md);
            expect(p.musicalMetadata).toEqual(md.musicalMetadata);
        });

        it('accepts exactly 1 BPM', () => {
            const md = minimalValidMetadata();
            md.musicalMetadata.tempo = { fixed: 1 };

            const p = new DropPiece(md);
            expect(p.musicalMetadata).toEqual(md.musicalMetadata);
        });

        it('accepts exactly 999.999 BPM', () => {
            const md = minimalValidMetadata();
            md.musicalMetadata.tempo = { fixed: 999.999 };

            const p = new DropPiece(md);
            expect(p.musicalMetadata).toEqual(md.musicalMetadata);
        });

        it('rejects too low BPM', () => {
            const md = minimalValidMetadata();
            md.musicalMetadata.tempo = { fixed: 0 };
            expect(() => new DropPiece(md)).toThrowError(/tempo/);
        });

        it('rejects too high BPM', () => {
            const md = minimalValidMetadata();
            md.musicalMetadata.tempo = { fixed: 1000 };
            expect(() => new DropPiece(md)).toThrowError(/tempo/);
        });

        it('rejects missing fixed field', () => {
            const md = minimalValidMetadata() as any;
            md.musicalMetadata.tempo = { };
            expect(() => new DropPiece(md)).toThrowError(/tempo/);
        });

        it('rejects invalid tempo type', () => {
            const md = minimalValidMetadata() as any;
            md.musicalMetadata.tempo = { fixed: 'banana' };
            expect(() => new DropPiece(md)).toThrowError(/tempo/);
        });
    });

    describe('loop markers', () => {
        it('accepts valid loop markers', () => {
            const md = minimalValidMetadata();
            md.musicalMetadata.loop = { startMicroseconds: 1000000, endMicroseconds: 2000000 };

            const p = new DropPiece(md);
            expect(p.musicalMetadata).toEqual(md.musicalMetadata);
        });

        it('accepts whole piece as loop', () => {
            const md = minimalValidMetadata();
            md.musicalMetadata.loop = { startMicroseconds: 0, endMicroseconds: 4000000 };

            const p = new DropPiece(md);
            expect(p.musicalMetadata).toEqual(md.musicalMetadata);
        });

        it('rejects loop without end', () => {
            const md = minimalValidMetadata() as any;
            md.musicalMetadata.loop = { startMicroseconds: 1000000 };
            expect(() => new DropPiece(md)).toThrowError(/loop/);
        });

        it('rejects loop without start', () => {
            const md = minimalValidMetadata() as any;
            md.musicalMetadata.loop = { endMicroseconds: 1000000 };
            expect(() => new DropPiece(md)).toThrowError(/loop/);
        });

        it('rejects empty loop', () => {
            const md = minimalValidMetadata() as any;
            md.musicalMetadata.loop = { };
            expect(() => new DropPiece(md)).toThrowError(/loop/);
        });

        it('rejects loop starting before zero', () => {
            const md = minimalValidMetadata();
            md.musicalMetadata.loop = { startMicroseconds: -1000, endMicroseconds: 1000 };
            expect(() => new DropPiece(md)).toThrowError(/loop/);
        });

        it('rejects loop ending after piece ends', () => {
            const md = minimalValidMetadata();
            md.musicalMetadata.loop = { startMicroseconds: 1000, endMicroseconds: 5000000 };
            expect(() => new DropPiece(md)).toThrowError(/loop/);
        });

        it('rejects reversed loop markers', () => {
            const md = minimalValidMetadata();
            md.musicalMetadata.loop = { startMicroseconds: 2000000, endMicroseconds: 1000000 };
            expect(() => new DropPiece(md)).toThrowError(/loop/);
        });

        it('rejects equal loop markers', () => {
            const md = minimalValidMetadata();
            md.musicalMetadata.loop = { startMicroseconds: 2000000, endMicroseconds: 2000000 };
            expect(() => new DropPiece(md)).toThrowError(/loop/);
        });

        it('rejects invalid loop start type', () => {
            const md = minimalValidMetadata() as any;
            md.musicalMetadata.loop = { startMicroseconds: 'banana', endMicroseconds: 2000000 };
            expect(() => new DropPiece(md)).toThrowError(/loop/);
        });

        it('rejects invalid loop end type', () => {
            const md = minimalValidMetadata() as any;
            md.musicalMetadata.loop = { startMicroseconds: 1000000, endMicroseconds: 'banana' };
            expect(() => new DropPiece(md)).toThrowError(/loop/);
        });
    });

    describe('time signature', () => {
        it('accepts valid time signature', () => {
            const md = minimalValidMetadata();
            md.musicalMetadata.timeSignature = { fixed: { upper: 4, lower: 4 } };

            const p = new DropPiece(md);
            expect(p.musicalMetadata).toEqual(md.musicalMetadata);
        });

        it('rejects odd lower numeral', () => {
            const md = minimalValidMetadata();
            md.musicalMetadata.timeSignature = { fixed: { upper: 4, lower: 5 } };
            expect(() => new DropPiece(md)).toThrowError(/timeSignature/);
        });

        it('rejects invalid upper numeral', () => {
            const md = minimalValidMetadata();
            md.musicalMetadata.timeSignature = { fixed: { upper: 17, lower: 4 } };
            expect(() => new DropPiece(md)).toThrowError(/timeSignature/);
        });

        it('rejects lower numeral of invalid type', () => {
            const md = minimalValidMetadata() as any;
            md.musicalMetadata.timeSignature = { fixed: { upper: 4, lower: 'banana' } };
            expect(() => new DropPiece(md)).toThrowError(/timeSignature/);
        });

        it('rejects upper numeral of invalid type', () => {
            const md = minimalValidMetadata() as any;
            md.musicalMetadata.timeSignature = { fixed: { upper: 'banana', lower: 4 } };
            expect(() => new DropPiece(md)).toThrowError(/timeSignature/);
        });

        it('rejects missing lower numeral', () => {
            const md = minimalValidMetadata() as any;
            md.musicalMetadata.timeSignature = { fixed: { upper: 4 } };
            expect(() => new DropPiece(md)).toThrowError(/timeSignature/);
        });

        it('rejects missing upper numeral', () => {
            const md = minimalValidMetadata() as any;
            md.musicalMetadata.timeSignature = { fixed: { lower: 4 } };
            expect(() => new DropPiece(md)).toThrowError(/timeSignature/);
        });

        it('rejects empty fixed time signature', () => {
            const md = minimalValidMetadata() as any;
            md.musicalMetadata.timeSignature = { fixed: { } };
            expect(() => new DropPiece(md)).toThrowError(/timeSignature/);
        });

        it('rejects empty time signature', () => {
            const md = minimalValidMetadata() as any;
            md.musicalMetadata.timeSignature = { };
            expect(() => new DropPiece(md)).toThrowError(/timeSignature/);
        });
    });

    describe('title', () => {
        it('rejects non-existant title', () => {
            const md = minimalValidMetadata() as any;
            delete md.presentation.title;
            expect(() => new DropPiece(md)).toThrowError(/title/);
        });

        it('rejects empty title', () => {
            const md = minimalValidMetadata();
            md.presentation.title = '';
            expect(() => new DropPiece(md)).toThrowError(/title/);
        });

        it('rejects too long title', () => {
            const md = minimalValidMetadata();
            md.presentation.title = 'Synth portland chicharrones, prism chambray ramps aesthetic meh tote bag messenger bag echo park post-ironic. 90s ramps man bun paleo, readymade stumptown truffaut heirloom pinterest.';
            expect(() => new DropPiece(md)).toThrowError(/title/);
        });

        it('rejects title of invalid type', () => {
            const md = minimalValidMetadata() as any;
            md.presentation.title = 123;
            expect(() => new DropPiece(md)).toThrowError(/title/);
        });
    });

    describe('attachment', () => {
        it('accepts attachment callback', () => {
            const md = minimalValidMetadata();
            md.attachment = { mimeType: 'application/figure', data: (callback: BlobCallback) => {}};
            expect(() => new DropPiece(md)).not.toThrow();
        });

        it('rejects attachment data of invalid type', () => {
            const md = minimalValidMetadata() as any;
            md.attachment = { mimeType: 'application/figure', data: 'banana'};
            expect(() => new DropPiece(md)).toThrowError(/attachment/);
        });

        it('rejects attachment mimeType of invalid type', () => {
            const md = minimalValidMetadata() as any;
            md.attachment = { mimeType: {}, data: (callback: BlobCallback) => {}};
            expect(() => new DropPiece(md)).toThrowError(/attachment/);
        });
    });

    describe('preview audio callback', () => {
        it('accepts preview audio callback', () => {
            const md = minimalValidMetadata();
            md.presentation.preview = (callback) => {};
            expect(() => new DropPiece(md)).not.toThrow();
        });

        it('rejects preview audio of invalid type', () => {
            const md = minimalValidMetadata() as any;
            md.presentation.preview = 'banana';
            expect(() => new DropPiece(md)).toThrowError(/preview/);
        });
    });

    describe('cover image callback', () => {
        it('accepts cover image callback', () => {
            const md = minimalValidMetadata();
            md.presentation.coverImage = (callback) => {};
            expect(() => new DropPiece(md)).not.toThrow();
        });

        it('rejects cover image of invalid type', () => {
            const md = minimalValidMetadata() as any;
            md.presentation.coverImage = 'banana';
            expect(() => new DropPiece(md)).toThrowError(/coverImage/);
        });
    });

    describe('mix stem callback', () => {
        it('rejects missing mix stem callback', () => {
            const md = minimalValidMetadata();
            delete md.stems.mixStem;
            expect(() => new DropPiece(md)).toThrowError(/mixStem/);
        });

        it('rejects cover image of invalid type', () => {
            const md = minimalValidMetadata() as any;
            md.stems.mixStem = 'banana';
            expect(() => new DropPiece(md)).toThrowError(/mixStem/);
        });
    });

    describe('attribution data', () => {
        it('accepts a list of strings', () => {
            const md = minimalValidMetadata();
            md.attribution = { basedOnPieces: [ 'one', 'two' ] };

            const p = new DropPiece(md);
            expect(p.attribution).toEqual(md.attribution);
        });

        it('converts Allihoopa URLs to short ids', () => {
            const md = minimalValidMetadata();
            md.attribution = { basedOnPieces: [
                'https://allihoopa.com/s/WwXiKvUZ',
                'https://allihoopa.com/s/VbUpAmUG',
            ] };

            const p = new DropPiece(md);
            expect(p.attribution).toEqual({ basedOnPieces: ['WwXiKvUZ', 'VbUpAmUG'] });
        });

        it('accepts no attribution information', () => {
            const md = minimalValidMetadata();
            delete md.attribution;

            const p = new DropPiece(md);
            expect(p.attribution).toEqual(md.attribution);
        });

        it('rejects a list of invalid types', () => {
            const md = minimalValidMetadata() as any;
            md.attribution = { basedOnPieces: [ 1, 2 ] };
            expect(() => new DropPiece(md)).toThrowError(/basedOnPieces/);
        });

        it('rejects based on pieces of invalid type', () => {
            const md = minimalValidMetadata() as any;
            md.attribution = { basedOnPieces: 'banana' };
            expect(() => new DropPiece(md)).toThrowError(/basedOnPieces/);
        });

        it('rejects missing based on pieces', () => {
            const md = minimalValidMetadata() as any;
            md.attribution = { };
            expect(() => new DropPiece(md)).toThrowError(/basedOnPieces/);
        });
    });

    describe('tonality', () => {
        it('accepts unknown tonality', () => {
            const md = minimalValidMetadata();
            md.musicalMetadata.tonality = { mode: 'UNKNOWN' };

            const p = new DropPiece(md);
            expect(p.musicalMetadata.tonality).toEqual(md.musicalMetadata.tonality);
        });

        it('accepts atonal tonality', () => {
            const md = minimalValidMetadata();
            md.musicalMetadata.tonality = { mode: 'ATONAL' };

            const p = new DropPiece(md);
            expect(p.musicalMetadata.tonality).toEqual(md.musicalMetadata.tonality);
        });

        it('accepts tonal tonality, root C', () => {
            const md = minimalValidMetadata();
            md.musicalMetadata.tonality = { mode: 'TONAL', scale: getMajorScale(0), root: 0 };

            const p = new DropPiece(md);
            expect(p.musicalMetadata.tonality).toEqual(md.musicalMetadata.tonality);
        });

        it('accepts tonal tonality, root B', () => {
            const md = minimalValidMetadata();
            md.musicalMetadata.tonality = { mode: 'TONAL', scale: getMajorScale(0), root: 11 };

            const p = new DropPiece(md);
            expect(p.musicalMetadata.tonality).toEqual(md.musicalMetadata.tonality);
        });

        it('rejects tonal tonality without scale values set', () => {
            const md = minimalValidMetadata();
            md.musicalMetadata.tonality = {
                mode: 'TONAL',
                scale: [false, false, false, false, false, false, false, false, false, false, false, false],
                root: 0,
            };

            expect(() => new DropPiece(md)).toThrowError(/tonality/);
        });

        it('rejects tonal tonality with too small scale', () => {
            const md = minimalValidMetadata();
            md.musicalMetadata.tonality = {
                mode: 'TONAL',
                scale: [false, false, false, false, false, false, false, false, false, false, false],
                root: 0,
            };

            expect(() => new DropPiece(md)).toThrowError(/tonality/);
        });

        it('rejects tonal tonality with too large scale', () => {
            const md = minimalValidMetadata();
            md.musicalMetadata.tonality = {
                mode: 'TONAL',
                scale: [false, false, false, false, false, false, false, false, false, false, false, false, false],
                root: 0,
            };

            expect(() => new DropPiece(md)).toThrowError(/tonality/);
        });

        it('rejects tonal tonality with non-boolean scale', () => {
            const md = minimalValidMetadata();
            md.musicalMetadata.tonality = {
                mode: 'TONAL',
                scale: ['banana', 'cucumber', true, false, false, false, false, false, false, false, false, false, false] as any,
                root: 0,
            };

            expect(() => new DropPiece(md)).toThrowError(/tonality/);
        });

        it('rejects tonal tonality with too low root', () => {
            const md = minimalValidMetadata();
            md.musicalMetadata.tonality = {
                mode: 'TONAL',
                scale: getMajorScale(0),
                root: -1,
            };

            expect(() => new DropPiece(md)).toThrowError(/tonality/);
        });

        it('rejects tonal tonality with too high root', () => {
            const md = minimalValidMetadata();
            md.musicalMetadata.tonality = {
                mode: 'TONAL',
                scale: [false, false, false, false, false, false, false, false, false, false, false, false],
                root: 12,
            };

            expect(() => new DropPiece(md)).toThrowError(/tonality/);
        });

        it('rejects tonal tonality with root not part of scale', () => {
            const md = minimalValidMetadata();
            md.musicalMetadata.tonality = {
                mode: 'TONAL',
                scale: getMajorScale(0),
                root: 1,
            };

            expect(() => new DropPiece(md)).toThrowError(/tonality/);
        });

        it('rejects tonal tonality with no scale or root', () => {
            const md = minimalValidMetadata();
            md.musicalMetadata.tonality = {
                mode: 'TONAL',
            } as any;

            expect(() => new DropPiece(md)).toThrowError(/tonality/);
        });

        it('rejects tonal tonality with invalid scale and root', () => {
            const md = minimalValidMetadata();
            md.musicalMetadata.tonality = {
                mode: 'TONAL',
                scale: 'banana',
                root: 1.3,
            } as any;

            expect(() => new DropPiece(md)).toThrowError(/tonality/);
        });

        it('rejects tonality with invalid mode', () => {
            const md = minimalValidMetadata();
            md.musicalMetadata.tonality = {
                mode: 'crazy_bananas',
            } as any;

            expect(() => new DropPiece(md)).toThrowError(/tonality/);
        });

        it('rejects tonality field with invalid type', () => {
            const md = minimalValidMetadata();
            md.musicalMetadata.tonality = 'banana' as any;

            expect(() => new DropPiece(md)).toThrowError(/tonality/);
        });
    });

    describe('primary properties', () => {
        it('rejects missing musical metadata', () => {
            const md = minimalValidMetadata() as any;
            delete md.musicalMetadata;
            expect(() => new DropPiece(md)).toThrowError(/musicalMetadata/);
        });

        it('rejects musical metadata of invalid type', () => {
            const md = minimalValidMetadata() as any;
            md.musicalMetadata = 'banana';
            expect(() => new DropPiece(md)).toThrowError(/musicalMetadata/);
        });

        it('rejects missing presentation data', () => {
            const md = minimalValidMetadata() as any;
            delete md.presentation;
            expect(() => new DropPiece(md)).toThrowError(/presentation/);
        });

        it('rejects presentation data of invalid type', () => {
            const md = minimalValidMetadata() as any;
            md.presentation = 'banana';
            expect(() => new DropPiece(md)).toThrowError(/presentation/);
        });

        it('rejects missing stems', () => {
            const md = minimalValidMetadata() as any;
            delete md.stems;
            expect(() => new DropPiece(md)).toThrowError(/stems/);
        });

        it('rejects stems of invalid type', () => {
            const md = minimalValidMetadata() as any;
            md.stems = 'banana';
            expect(() => new DropPiece(md)).toThrowError(/stems/);
        });
    });
});

function minimalValidMetadata(): DropPieceData {
    return {
        musicalMetadata: { lengthMicroseconds: 4000000 },
        presentation: { title: 'Default title' },
        stems: { mixStem: (callback) => {} },
    };
}
