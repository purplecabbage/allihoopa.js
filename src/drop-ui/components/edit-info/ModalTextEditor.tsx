import * as Radium from 'radium';
import * as React from 'react';

import * as CommonStyles from '../../styles/CommonStyles';

export interface ModalTextEditorProps {
    title: string;
    value: string;
    extraTextareaStyle?: React.CSSProperties;
    maxLength: number;
    onChange: (value: string) => void;
    onClose: () => void;
}

@Radium
export class ModalTextEditor extends React.Component<ModalTextEditorProps, void> {
    textarea: HTMLTextAreaElement;
    navbar: HTMLElement;

    componentDidMount() {
        this.textarea.focus();
    }

    render(): JSX.Element {
        return (
            <div style={OVERLAY_STYLE}>
                <div
                    style={NAVBAR_STYLE}
                    ref={elem => this.navbar = elem}
                >
                    <span style={COUNTER_STYLE}>{this.props.maxLength - this.props.value.length}</span>
                    <button
                        style={[CommonStyles.FLAT_BUTTON_STYLE, DONE_BUTTON_STYLE]}
                        onClick={this.props.onClose}
                    >
                        Done
                    </button>
                </div>

                <div style={TITLE_STYLE}>{this.props.title}</div>

                <textarea
                    value={this.props.value}
                    style={[CommonStyles.INPUT_RESET_STYLE, TEXTAREA_STYLE, this.props.extraTextareaStyle]}
                    ref={elem => this.textarea = elem}
                    maxLength={this.props.maxLength}
                    onChange={e => this.props.onChange((e.target as HTMLTextAreaElement).value)}
                    onFocus={() => this.scrollToTop()}
                    onBlur={this.props.onClose}
                />
            </div>
        );
    }

    private scrollToTop() {
        this.navbar.scrollIntoView();
    }
}

const OVERLAY_STYLE: React.CSSProperties = {
    position: 'absolute',
    width: 'calc(100% + 32px)',
    height: '100%',
    top: 0,
    left: 0,
    background: '#fff',
    display: 'flex',
    flexDirection: 'column',
    margin: '0 -16px',
};

const NAVBAR_STYLE: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    padding: '12px 16px',
    borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
};

const COUNTER_STYLE: React.CSSProperties = {
    color: '#c8c8c8',
    fontSize: 14,
    WebkitTransform: 'translate3d(0, 0, 0)',
};

const TITLE_STYLE: React.CSSProperties = {
    color: '#c8c8c8',
    fontSize: 14,
    margin: '16px 16px 0 16px',
};

const TEXTAREA_STYLE: React.CSSProperties = {
    color: CommonStyles.MASALA_COLOR,
    fontSize: 28,
    fontFamily: CommonStyles.FONT_STACK,
    letterSpacing: -1,
    flexGrow: 1,
    margin: '0 16px',
    WebkitTransform: 'translate3d(0, 0, 0)',
};

const DONE_BUTTON_STYLE: React.CSSProperties = {
    color: CommonStyles.BRIGHT_MAGENTA_COLOR,
    paddingRight: 0,
    textAlign: 'right',
};
