import * as Radium from 'radium';
import * as React from 'react';

import * as CommonStyles from '../../styles/CommonStyles';

import {CoverImageEditor} from './CoverImageEditor';
import {ModalTextEditor} from './ModalTextEditor';

import {CircledAddIcon} from '../../../icons/CircledAddIcon';

export interface DataEntryProps {
    title: string;
    description: string;
    coverImageDataURL: string | null;

    onTitleChange: (title: string) => void;
    onDescriptionChange: (description: string) => void;
    onCoverImageChange: (image: Blob) => void;
}

export interface DataEntryState {
    focusedField: null | 'title' | 'description';
    modalEditorField: null | 'title' | 'description';
}

@Radium
export class DataEntry extends React.Component<DataEntryProps, DataEntryState> {
    constructor(props: DataEntryProps) {
        super(props);

        this.state = {
            focusedField: null,
            modalEditorField: null,
        };
    }

    render(): JSX.Element {
        const titleActive = this.state.focusedField === 'title';
        const descriptionActive = this.state.focusedField === 'description';

        const showDescriptionAddButton = !descriptionActive && !this.props.description;

        return (
            <div style={CONTAINER_STYLE}>
                <div style={COVER_IMAGE_CONTAINER_STYLE}>
                    <CoverImageEditor
                        dataURL={this.props.coverImageDataURL}
                        onChange={this.props.onCoverImageChange}
                    />
                </div>

                <div style={TEXT_EDITORS_CONTAINER_STYLE}>
                    <div
                        style={[TITLE_CONTAINER_STYLE, titleActive ? ACTIVE_CONTAINER_STYLE : null]}
                        key='title-container'
                    >
                        <div style={EDITOR_TITLE_STYLE}>
                            <span>Title</span>
                            <span style={[COUNTER_STYLE, {opacity: titleActive ? 1 : 0}]}>{50 - this.props.title.length}</span>
                        </div>
                        <input
                            style={[
                                CommonStyles.INPUT_RESET_STYLE,
                                CommonStyles.HIDDEN_XS,
                                TITLE_STYLE,
                            ]}
                            maxLength={50}
                            value={this.props.title}
                            onFocus={() => this.setState({ focusedField: 'title' } as DataEntryState)}
                            onBlur={() => this.setState({ focusedField: null } as DataEntryState)}
                            onChange={e => this.props.onTitleChange((e.target as HTMLInputElement).value)}
                        />
                        <span
                            style={[
                                CommonStyles.INPUT_RESET_STYLE,
                                CommonStyles.HIDDEN_SM,
                                TITLE_STYLE,
                            ]}
                            onClick={() => this.setState({ modalEditorField: 'title' } as DataEntryState)}
                        >
                            {this.props.title}
                        </span>
                    </div>

                    <div
                        style={[DESCRIPTION_CONTAINER_STYLE, descriptionActive ? ACTIVE_CONTAINER_STYLE : null]}
                        key='description-container'
                    >
                        <div style={EDITOR_TITLE_STYLE}>
                            <span>Description and Tags</span>
                            <span style={[COUNTER_STYLE, {opacity: descriptionActive ? 1 : 0}]}>{140 - this.props.description.length}</span>
                        </div>
                        <textarea
                            style={[
                                CommonStyles.INPUT_RESET_STYLE,
                                CommonStyles.HIDDEN_XS,
                                DESCRIPTION_STYLE,
                                showDescriptionAddButton && INSET_DESCRIPTION_STYLE,
                            ]}
                            maxLength={140}
                            placeholder='Add'
                            value={this.props.description}
                            onFocus={() => this.setState({ focusedField: 'description' } as DataEntryState)}
                            onBlur={() => this.setState({ focusedField: null } as DataEntryState)}
                            onChange={e => this.props.onDescriptionChange((e.target as HTMLTextAreaElement).value)}
                        />
                        <span
                            style={[
                                CommonStyles.INPUT_RESET_STYLE,
                                CommonStyles.HIDDEN_SM,
                                DESCRIPTION_STYLE,
                                showDescriptionAddButton && INSET_DESCRIPTION_STYLE,
                            ]}
                            onClick={() => this.setState({ modalEditorField: 'description' } as DataEntryState)}
                        >
                            {this.props.description ||
                                <span style={{color: CommonStyles.MASALA_COLOR}}>Add</span>}
                        </span>
                        <div style={[ADD_ICON_STYLE, !showDescriptionAddButton && HIDE_ADD_ICON_STYLE]}>
                            <CircledAddIcon />
                        </div>
                    </div>
                </div>

                {this.renderModalEditor()}
            </div>
        );
    }

    renderModalEditor(): JSX.Element | null {
        if (this.state.modalEditorField === 'title') {
            return (
                <ModalTextEditor
                    title='Title of your piece'
                    value={this.props.title}
                    maxLength={50}
                    extraTextareaStyle={{fontWeight: CommonStyles.FONT_WEIGHT_BOLD}}
                    onChange={this.props.onTitleChange}
                    onClose={() => this.setState({ modalEditorField: null } as DataEntryState)}
                />
            );
        }
        else if (this.state.modalEditorField === 'description') {
            return (
                <ModalTextEditor
                    title='Description and Tags'
                    value={this.props.description}
                    maxLength={140}
                    extraTextareaStyle={{
                        fontWeight: CommonStyles.FONT_WEIGHT_LIGHT,
                        fontSize: 24,
                        letterSpacing: -0.9,
                    }}
                    onChange={this.props.onDescriptionChange}
                    onClose={() => this.setState({ modalEditorField: null } as DataEntryState)}
                />
            );
        }

        return null;
    }
}

const EDITOR_TITLE_STYLE: React.CSSProperties = {
    color: '#c8c8c8',
    fontSize: 12,

    display: 'flex',
    justifyContent: 'space-between',
};

const TITLE_STYLE: React.CSSProperties = {
    color: CommonStyles.MASALA_COLOR,
    fontFamily: CommonStyles.FONT_STACK,
    fontSize: 22,
    fontWeight: CommonStyles.FONT_WEIGHT_BOLD,
    display: 'block',
    width: '100%',
    wordBreak: 'break-all',
};

const DESCRIPTION_STYLE: React.CSSProperties = {
    color: CommonStyles.MASALA_COLOR,
    fontFamily: CommonStyles.FONT_STACK,
    fontSize: 18,
    fontWeight: CommonStyles.FONT_WEIGHT_LIGHT,
    display: 'block',
    width: '100%',
    transition: 'padding 0.12s ease-in-out',
    wordBreak: 'break-all',

    [CommonStyles.MQ_MIN_WIDTH_SMALL]: {
        flexGrow: 1,
    },
};

const TITLE_CONTAINER_STYLE: React.CSSProperties = {
    marginBottom: 22,

    [CommonStyles.MQ_MIN_WIDTH_SMALL]: {
        background: 'rgba(0, 0, 0, 0.02)',
        border: '1px solid rgba(0, 0, 0, 0.0)',
        marginBottom: 20,
        padding: '16px 20px',
        transition: 'background 0.12s ease-in-out',

        ':hover': {
            border: '1px solid rgba(155, 155, 155, 0.13)',
        },
    },
};

const DESCRIPTION_CONTAINER_STYLE: React.CSSProperties = {
    position: 'relative',
    marginBottom: 22,

    [CommonStyles.MQ_MIN_WIDTH_SMALL]: {
        background: 'rgba(0, 0, 0, 0.02)',
        border: '1px solid rgba(0, 0, 0, 0.0)',
        flexGrow: 1,
        marginBottom: 0,
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        transition: 'background 0.12s ease-in-out',

        ':hover': {
            border: '1px solid rgba(155, 155, 155, 0.13)',
        },
    },
};

const ACTIVE_CONTAINER_STYLE: React.CSSProperties = {
    [CommonStyles.MQ_MIN_WIDTH_SMALL]: {
        background: '#fff',
        border: '1px solid rgba(155, 155, 155, 0.13)',
    },
};

const COVER_IMAGE_CONTAINER_STYLE: React.CSSProperties = {
    marginBottom: 22,

    [CommonStyles.MQ_MIN_WIDTH_SMALL]: {
        width: 260,
        height: 260,
        marginRight: 16,
        marginBottom: 0,
    },
};

const CONTAINER_STYLE: React.CSSProperties = {
    WebkitTransform: 'translate3d(0, 0, 0)',

    [CommonStyles.MQ_MIN_WIDTH_SMALL]: {
        display: 'flex',
        flexDirection: 'row',
    },
};

const TEXT_EDITORS_CONTAINER_STYLE: React.CSSProperties = {
    [CommonStyles.MQ_MIN_WIDTH_SMALL]: {
        flexGrow: '1',
        display: 'flex',
        flexDirection: 'column',
    },
};

const ADD_ICON_STYLE: React.CSSProperties = {
    position: 'absolute',
    top: 22,
    width: 20,
    overflow: 'hidden',
    transition: 'width 0.12s ease-in-out',

    [CommonStyles.MQ_MIN_WIDTH_SMALL]: {
        top: 38,
    },
};

const HIDE_ADD_ICON_STYLE: React.CSSProperties = {
    width: 0,
};

const INSET_DESCRIPTION_STYLE: React.CSSProperties = {
    padding: '0 0 0 30px',
};

const COUNTER_STYLE: React.CSSProperties = {
    transition: 'opacity 0.12s ease-in-out',
};
