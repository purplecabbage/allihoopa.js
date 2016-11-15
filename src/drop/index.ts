import {authenticate} from '../auth';

import {Coordinator, DropCompletionCallback} from './Coordinator';
import {DropPiece} from './PieceData';

export function drop(piece: DropPiece, callback: DropCompletionCallback) {
    authenticate(successful => {
        if (successful) {
            const coordinator = new Coordinator({
                piece: piece,
                onDropCompleted: callback,
                onInitialCoverImageDidArrive: null,
            });
            coordinator.commitEditorDefaults();
        }
        else {
            callback(null, new Error('Could not log in'));
        }
    });
}
