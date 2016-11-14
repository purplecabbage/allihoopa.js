import {Coordinator, DropCompletionCallback} from './Coordinator';
import {DropPiece} from './PieceData';

export function drop(piece: DropPiece, callback: DropCompletionCallback) {
    const coordinator = new Coordinator({
        piece: piece,
        onDropCompleted: callback,
        onInitialCoverImageDidArrive: null,
    });
    coordinator.commitEditorDefaults();
}
