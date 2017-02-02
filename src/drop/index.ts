import {authenticate} from '../auth';

import {Coordinator, DropCompletionCallback} from './Coordinator';
import {ProgressCallback} from './DropAPI';
import {DropPiece} from './PieceData';

export function drop(
    piece: DropPiece,
    onDropCompleted: DropCompletionCallback,
    onProgress?: ProgressCallback,
) {
    authenticate(successful => {
        if (successful) {
            const coordinator = new Coordinator({
                piece: piece,
                onDropCompleted: onDropCompleted,
                onProgress: onProgress,
            });
            coordinator.commitEditorDefaults();
        }
        else {
            onDropCompleted(null, new Error('Could not log in'));
        }
    });
}
