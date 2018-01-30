import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {authenticate} from '../auth';
import {DropCompletionCallback} from '../drop/Coordinator';
import {CreatedPiece} from '../drop/DropInterfaces';
import {DropPiece} from '../drop/PieceData';

import {Controller} from './components/Controller';
import {Overlay} from './components/Overlay';

export type DropCallback = (successful: boolean) => void;
export type AuthCallback = (successful: boolean) => void;
export type AuthHandler = (callback: AuthCallback) => void;

export function drop(piece: DropPiece, callback: DropCompletionCallback, authHandler: AuthHandler = authenticate) {
    if (!piece) {
        throw new Error('Piece argument not provided');
    }

    if (!(piece instanceof DropPiece)) {
        throw new Error('Provided piece is not an Allihoopa.DropPiece instance');
    }

    if (callback && !(callback instanceof Function)) {
        throw new Error('Provided completion callback is not a function');
    }

    if (!(authHandler instanceof Function)) {
        throw new Error('Provided auth handler is not a function')
    }

    authHandler(success => {
        if (success) {
            renderDrop(piece, callback);
        }
    });
}

function renderDrop(piece: DropPiece, callback: DropCompletionCallback) {
    const container = document.createElement('div');
    document.body.appendChild(container);

    let createdPiece: CreatedPiece | null = null;
    let error: Error | null = null;

    const onClose = () => {
        if (container) {
            ReactDOM.unmountComponentAtNode(container);
            if (container.parentNode) {
                container.parentNode.removeChild(container);
            }
        }
        if (callback) {
            callback(createdPiece, error);
        }
    };

    const onComplete: DropCompletionCallback = (piece, error) => {
        createdPiece = piece;
        error = error;
    };

    ReactDOM.render(
        <Overlay>
            <Controller
                input={piece}
                onClose={onClose}
                onDropComplete={onComplete}
            />
        </Overlay>,
        container,
    );
}
