import * as Radium from 'radium';
import * as React from 'react';

import * as CommonStyles from '../../styles/CommonStyles';

import {DataEntry} from './DataEntry';
import {Title} from './Title';
import {Toggle} from './Toggle';

import {AllihoopaLogo, LogoMode} from '../../../icons/AllihoopaLogo';


export interface EditInfoState {
    title: string;
    description: string;
    listed: boolean;
    coverImageDataURL: string | null;
    coverImageBinary: Blob | null;
}

export interface EditInfoProps {
    initialTitle: string;
    initialCoverImageBinary: Blob | null;
    onCommit: (info: EditInfoState) => void;
    onCancel: () => void;
}


@Radium
export class EditInfo extends React.Component<EditInfoProps, EditInfoState> {
    imageInput: HTMLInputElement;

    constructor(props: EditInfoProps) {
        super(props);

        this.state = {
            title: props.initialTitle,
            description: '',
            listed: true,
            coverImageDataURL: null,
            coverImageBinary: null,
        };

        if (props.initialCoverImageBinary) {
            this.fetchCoverImage(props.initialCoverImageBinary);
        }
    }

    componentWillReceiveProps(nextProps: EditInfoProps) {
        if (!this.state.coverImageBinary && nextProps.initialCoverImageBinary) {
            this.fetchCoverImage(nextProps.initialCoverImageBinary);
        }
    }

    render(): JSX.Element {
        return (
            <div style={CONTAINER_STYLE}>
                <Title
                    onClose={this.props.onCancel}
                />

                <DataEntry
                    title={this.state.title}
                    description={this.state.description}
                    coverImageDataURL={this.state.coverImageDataURL}

                    onTitleChange={title => this.setState({title} as EditInfoState)}
                    onDescriptionChange={description => this.setState({description} as EditInfoState)}
                    onCoverImageChange={image => this.fetchCoverImage(image)}
                />

                {this.renderVisibilityEditor()}
                {this.renderButtons()}
            </div>
        );
    }

    private renderVisibilityEditor(): JSX.Element {
        return (
            <div>
                <div>
                    <span style={[VISIBILITY_STYLE]}>Visibility</span>
                    <Toggle
                        enabledTitle='Listed'
                        disabledTitle='Unlisted'
                        enabledDescription='Anyone can see this'
                        disabledDescription='You need a direct link to see this'
                        value={this.state.listed}
                        onChange={value => this.setState({listed: value} as EditInfoState)}
                    />
                </div>
            </div>
        );
    }

    private renderButtons(): JSX.Element {
        return (
            <div style={BUTTONS_STYLE}>
                <button
                    key='cancel'
                    style={[CommonStyles.FLAT_BUTTON_STYLE, CANCEL_BUTTON_STYLE]}
                    onClick={this.props.onCancel}
                >
                    Cancel
                </button>

                <button
                    key='drop'
                    style={[CommonStyles.FLAT_BUTTON_STYLE, DROP_BUTTON_STYLE]}
                    onClick={e => this.handleDropClick(e)}
                    disabled={!this.state.title || this.state.title.length <= 0}
                >
                    <AllihoopaLogo
                        mode={LogoMode.WhiteMonochrome}
                        style={DROP_BUTTON_ICON_STYLE}
                    />
                    <span>Drop</span>
                </button>
            </div>
        );
    }


    private fetchCoverImage(image: Blob) {
        const dataURLReader = new FileReader();

        dataURLReader.onloadend = () => {
            this.setState({
                coverImageBinary: image,
                coverImageDataURL: dataURLReader.result,
            } as EditInfoState);
        };

        dataURLReader.readAsDataURL(image);
    }


    private handleDropClick(e: React.SyntheticEvent): void {
        e.preventDefault();

        this.props.onCommit(this.state);
    }
}

const CONTAINER_STYLE: React.CSSProperties = {
    [CommonStyles.MQ_MIN_WIDTH_SMALL]: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
};

const VISIBILITY_STYLE = {
    display: 'inline-block',
    fontSize: 12,
    color: '#c8c8c8',
    verticalAlign: 'top',
    marginBottom: '8px',

    [CommonStyles.MQ_MIN_WIDTH_SMALL]: {
        marginTop: '16px',
    },

    [CommonStyles.MQ_MAX_WIDTH_SMALL]: {
        display: 'block',
        borderTop: '1px solid rgba(74, 74, 74, 0.1)',
        paddingTop: 20,
    },
};

const BUTTONS_STYLE = {
    [CommonStyles.MQ_MIN_WIDTH_SMALL]: {
        borderTop: '1px solid rgba(74, 74, 74, 0.1)',
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: 56,
        paddingTop: 46,
    },

    [CommonStyles.MQ_MAX_WIDTH_SMALL]: {
        margin: '80px -16px -16px -16px',
    },
};

const CANCEL_BUTTON_STYLE = {
    display: 'none',

    [CommonStyles.MQ_MIN_WIDTH_SMALL]: {
        display: 'block',
        padding: '8px 22px',
        border: `1px solid ${CommonStyles.DUSTY_GRAY_COLOR}`,
        color: CommonStyles.DUSTY_GRAY_COLOR,
    },
};

const DROP_BUTTON_STYLE = {
    background: CommonStyles.BRIGHT_MAGENTA_COLOR,
    color: '#fff',

    [CommonStyles.MQ_MIN_WIDTH_SMALL]: {
        marginLeft: '20px',
        padding: '8px 22px',
    },

    [CommonStyles.MQ_MAX_WIDTH_SMALL]: {
        padding: 14,
        width: '100%',
        marginBottom: 0,
    },
};

const DROP_BUTTON_ICON_STYLE = {
    width: 17,
    height: 17,
    marginRight: 8,
    marginBottom: -3,
};
