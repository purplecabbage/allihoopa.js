enum Tag {
    Orientation = 0x0112,
}

const INTERESTING_TAGS = [ Tag.Orientation ];

interface Segment {
    identifier: number;
    size: number | null;
}

type TagData = {[key: number]: any};

class JPEGParser {
    data: Uint8Array;
    pos: number;
    tagData: TagData | null;

    constructor(data: Uint8Array) {
        this.data = data;
        this.pos = 0;
        this.tagData = null;

        this.expect([0xff, 0xd8]);

        while (this.pos < this.data.length) {
            let segment = this.peekSegment();
            if (!segment) throw new Error('No segment found');

            if (segment.identifier === 0xe1) {
                this.tagData = this.readExifData(segment);
                return;
            }

            this.skipSegment(segment);
        }
    }

    private expect(bytes: [number]) {
        for (let i = 0; i < bytes.length; ++i) {
            if (this.data[this.pos + i] !== bytes[i]) {
                throw new Error(`Unexpected byte, got ${this.data[this.pos + i]}, expected ${bytes[i]}`);
            }
        }

        this.pos += bytes.length;
    }

    private peekSegment(): Segment | null {
        if (this.pos >= this.data.length) {
            return null;
        }

        if (this.data[this.pos] !== 0xff) {
            throw new Error('Not at segment boundary');
        }

        let ident = this.data[this.pos + 1];
        let size: number = 0;

        if (ident === 0xe0 || ident === 0xe1 || ident === 0xe2) {
            size = 256 * this.data[this.pos + 2] + this.data[this.pos + 3];
        }
        else if (ident !== 0xda && ident !== 0xd9) {
            throw new Error(`Unknown segment ${ident}`);
        }

        if (size > 65535) {
            throw new Error('JPEG segment too big');
        }

        return { identifier: ident, size: size };
    }

    private skipSegment(segment: Segment) {
        if (segment.size !== null) {
            this.pos += 2 + segment.size;
        }
        else {
            this.pos += 2;
        }
    }

    private readExifData(segment: Segment): TagData {
        const size = segment.size;
        if (!size) {
            throw new Error('Exif segment can not be unsized');
        }

        const dv = new DataView(this.data.buffer, this.pos + 4, size);
        if (dv.getUint8(0) !== 'E'.charCodeAt(0)
            || dv.getUint8(1) !== 'x'.charCodeAt(0)
            || dv.getUint8(2) !== 'i'.charCodeAt(0)
            || dv.getUint8(3) !== 'f'.charCodeAt(0)) {
            throw Error('Not an Exif block');
        }

        let littleEndian: boolean;

        if (dv.getUint16(6) === 0x4949) {
            littleEndian = true;
        }
        else if (dv.getUint16(6) === 0x4d4d) {
            littleEndian = false;
        }
        else {
            throw new Error(`Unknown byte order ${dv.getUint16(6)}`);
        }

        if (dv.getUint16(8, littleEndian) !== 0x002a) {
            throw new Error('Missing TIFF header');
        }

        const firstOffset = dv.getUint32(10, littleEndian);
        if (firstOffset < 8) {
            throw new Error('Missing TIFF data');
        }

        const entryCount = dv.getUint16(6 + firstOffset, littleEndian);

        let tags: {[key: number]: any} = {};

        for (let i = 0; i < entryCount; ++i) {
            const start = 6 + firstOffset + i * 12 + 2;
            const tag = dv.getUint16(start, littleEndian);

            if (INTERESTING_TAGS.indexOf(tag) !== -1) {
                const type = dv.getUint16(start + 2, littleEndian);
                const count = dv.getUint32(start + 4, littleEndian);

                if (count !== 1) {
                    throw new Error(`Unsupported value count: ${count}`);
                }

                switch (type) {
                case 3:
                    tags[tag] = dv.getUint16(start + 8, littleEndian);
                    break;
                default:
                    throw new Error(`Unknown data type: ${type}`);
                }
            }
        }

        return tags;
    }
}

export function getJPEGOrientation(data: Uint8Array): number | null {
    try {
        const parser = new JPEGParser(data);
        if (parser.tagData && typeof parser.tagData[Tag.Orientation] === 'number') {
            return parser.tagData[Tag.Orientation];
        }
    }
    catch (error) {
        // It doesn't really matter if this fails. It gets here when it's a
        // PNG file, for example. Set a breakpoint here if you're debugging.
    }

    return null;
}
