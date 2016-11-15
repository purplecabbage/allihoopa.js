import * as React from 'react';

import {getApplicationIdentifier} from '../../config';
import {graphQLQuery, Result} from '../../graphql';

import {Coordinator, DropCompletionCallback} from '../../drop/Coordinator';
import {CreatedPiece} from '../../drop/DropInterfaces';
import {DropPiece} from '../../drop/PieceData';

import {EditInfo, EditInfoState} from './edit-info/EditInfo';
import {CompletedView} from './CompletedView';
import {ErrorView} from './ErrorView';
import {WaitingView} from './WaitingView';

export interface AppInfo {
    app: {
        name: string;
    } | null;
}

const APP_INFO_QUERY = `
query($identifier: String!) {
  app(identifier: $identifier) {
    name
  }
}
`;

export interface ControllerState {
    isEditingCommitted: boolean;
    appInfo: AppInfo | null;

    createdPieceResult: Result<CreatedPiece> | null;
    initialCoverImage: Blob | null;
    input: DropPiece;
}

export interface ControllerProps {
    input: DropPiece;
    onClose: () => void;
    onDropComplete: DropCompletionCallback;
}

export class Controller extends React.Component<ControllerProps, ControllerState> {
    coordinator: Coordinator;

    constructor(props: ControllerProps) {
        super(props);

        this.state = {
            input: props.input,
            isEditingCommitted: false,
            appInfo: null,
            createdPieceResult: null,
            initialCoverImage: null,
        };
    }

    componentDidMount() {
        this.coordinator = new Coordinator({
            onDropCompleted: (piece, error) => {
                if (piece) {
                    this.setState({ createdPieceResult: { status: 'OK', data: piece }} as ControllerState);
                }
                else if (error) {
                    this.setState({ createdPieceResult: { status: 'ERROR', error: error }} as ControllerState);
                }

                this.props.onDropComplete(piece, error);
            },
            onInitialCoverImageDidArrive: image => {
                this.setState({ initialCoverImage: image } as ControllerState);
            },
            piece: this.state.input,
        });

        graphQLQuery(APP_INFO_QUERY, {identifier: getApplicationIdentifier()}, result => {
            if (result.status === 'OK') {
                this.setState({
                    appInfo: result.data,
                } as ControllerState);
            }
        });
    }

    componentWillUnmount() {
        this.coordinator.cancel();
    }

    render(): JSX.Element {
        if (!this.state.isEditingCommitted) {
            return <EditInfo
                initialTitle={this.props.input.presentation.title}
                initialCoverImageBinary={this.state.initialCoverImage}
                onCommit={s => this.handleEditInfoCommit(s)}
                onCancel={() => this.handleEditInfoCancel()}
            />;
        }
        else if (this.state.createdPieceResult && this.state.createdPieceResult.status === 'ERROR') {
            return <ErrorView onClose={this.props.onClose} />;
        }
        else if (this.state.isEditingCommitted && !this.state.createdPieceResult) {
            return <WaitingView />;
        }
        else if (this.state.createdPieceResult && this.state.createdPieceResult.status === 'OK') {
            return (
                <CompletedView
                    closeFunction={this.props.onClose}
                    dropPiece={this.state.createdPieceResult.data}
                    appName={this.state.appInfo && this.state.appInfo.app && this.state.appInfo.app.name}
                />
            );
        }
        throw new Error('Unknown state');
    }

    private handleEditInfoCommit(info: EditInfoState) {
        this.setState({
            isEditingCommitted: true,
        } as ControllerState);

        this.coordinator.commitEditor(info);
    }

    private handleEditInfoCancel() {
        this.props.onClose();
    }
}
