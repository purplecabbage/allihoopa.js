import * as Radium from 'radium';
import * as React from 'react';

import * as CommonStyles from '../../styles/CommonStyles';

import {DefaultCover} from '../../../icons/DefaultCover';

import {getJPEGOrientation} from '../../../utils/jpeg';

export interface CoverImageEditorProps {
    dataURL: string | null;
    onChange: (image: Blob) => void;
}

@Radium
export class CoverImageEditor extends React.Component<CoverImageEditorProps, void> {
    imageInput: HTMLInputElement | null;

    render(): JSX.Element {
        return (
            <div
                style={CONTAINER_STYLE}
            >
                { this.props.dataURL
                    ? <img
                        style={{ width: '100%', height: '100%' }}
                        src={this.props.dataURL}
                    />
                    : <DefaultCover />
                }

                <button
                    style={[CommonStyles.FLAT_BUTTON_STYLE, BUTTON_STYLE]}
                    onClick={(e) => this.handleOpenFileBrowser(e)}
                >
                    Edit Cover
                </button>

                <input
                    type='file'
                    accept='image/png,image/jpg'
                    ref={input => { this.imageInput = input; }}
                    style={{display: 'none'}}
                    value=''
                    onChange={e => this.handleImageInput(e)} />
            </div>
        );
    }

    private handleImageInput(e: React.FormEvent): void {
        const files = (e.target as HTMLInputElement).files;
        if (!files) {
            return;
        }

        const imageBlob = files[0];
        if (!imageBlob) {
            return;
        }

        // Square center crop the image. This roughly works as follows:
        //
        // 1. Convert the Blob in the files array into a data URL
        // 2. Assign the Data URL to an Image instance
        // 3. Wait for the Image to load, crop and draw it on a 2d Canvas
        // 4. Convert the canvas to a data URL
        // 5. Use the `dataURLToBlob` function to convert it to a Blob
        // 6. Pass the Blob to the `onChange` callback
        const reader = new FileReader();
        reader.onload = () => {
            const originalDataUrl = reader.result;
            const originalBlob = dataURLToUint8Array(originalDataUrl);
            const orientation = getJPEGOrientation(originalBlob);

            const image = new Image();
            image.onload = () => {
                const canvas: HTMLCanvasElement = document.createElement('canvas');
                canvas.width = 640;
                canvas.height = 640;

                const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
                if (!ctx) {
                    throw new Error('Internal error: could not create rendering context');
                }

                let sx: number, sy: number, cw: number, ch: number;

                const destSize = 640;

                if (image.width > image.height) {
                    sx = (image.width - image.height) / 2;
                    sy = 0;
                    cw = image.height;
                    ch = image.height;
                }
                else {
                    sx = 0;
                    sy = (image.height - image.width) / 2;
                    cw = image.width;
                    ch = image.width;
                }

                switch (orientation) {
                case 2:
                    // Horizontal flip
                    ctx.translate(destSize, 0);
                    ctx.scale(-1, 1);
                    break;
                case 3:
                    // 180 degree rotation
                    ctx.translate(destSize, destSize);
                    ctx.rotate(Math.PI);
                    break;
                case 4:
                    // Horizontal flip + 180 degree rotation
                    ctx.translate(0, destSize);
                    ctx.scale(1, -1);
                    break;
                case 5:
                    // Horizontal flip + 270 degree rotation ERR
                    ctx.rotate(0.5 * Math.PI);
                    ctx.scale(1, -1);
                    break;
                case 6:
                    // 270 degree rotation
                    ctx.rotate(.5 * Math.PI);
                    ctx.translate(0, -destSize);
                    break;
                case 7:
                    // Horizontal flip + 90 degree rotation
                    ctx.rotate(.5 * Math.PI);
                    ctx.translate(destSize, -destSize);
                    ctx.scale(-1, 1);
                    break;
                case 8:
                    // 90 degree rotation
                    ctx.rotate(-0.5 * Math.PI);
                    ctx.translate(-destSize, 0);
                    break;
                }

                ctx.drawImage(image, sx, sy, cw, ch, 0, 0, destSize, destSize);

                const cropURL = canvas.toDataURL('image/png');
                this.props.onChange(dataURLToBlob(cropURL));
            };
            image.src = reader.result;
        };

        reader.readAsDataURL(imageBlob);
    }

    private handleOpenFileBrowser(e: React.SyntheticEvent): void {
        e.preventDefault();

        const coverImageInput = this.imageInput;

        if (!coverImageInput) {
            throw new Error('Could not find element');
        }

        coverImageInput.click();
    }
}

function dataURLToBlob(dataURL: string): Blob {
    const arr: string[] = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/);
    if (!mime) { throw new Error('Internal error: no mime type found'); }

    return new Blob([dataURLToUint8Array(dataURL)], {type: mime[1]});
}

function dataURLToUint8Array(dataURL: string): Uint8Array {
    const arr: string[] = dataURL.split(',');

    const bstr = atob(arr[1]);
    const u8arr = new Uint8Array(bstr.length);

    for (let i = 0; i < bstr.length; ++i) {
        u8arr[i] = bstr.charCodeAt(i);
    }

    return u8arr;
}

const BUTTON_STYLE: React.CSSProperties = {
    color: '#fff',
    background: 'rgba(0, 0, 0, 0.3)',
    border: '1px solid #fff',
    cursor: 'pointer',
    position: 'absolute',
    bottom: 20,
    left: 16,
    width: 'calc(100% - 32px)',
    padding: 8,
};

const CONTAINER_STYLE: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '100%',
};
