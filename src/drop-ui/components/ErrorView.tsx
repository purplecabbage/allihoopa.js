import * as Radium from 'radium';
import * as React from 'react';

import * as CommonStyles from '../styles/CommonStyles';

export interface ErrorProps {
    onClose: () => void;
}

@Radium
export class ErrorView extends React.Component<ErrorProps, void> {
    render() {
        return (
            <div style={[CommonStyles.CENTERED_CONTAINER_STYLE, VIEW_STYLE]}>
                <div style={CONTAINER_STYLE}>
                    <div style={TITLE_STYLE}>
                        Oops! Something went wrong. Please try again later
                    </div>
                    <button
                        style={[CommonStyles.FLAT_BUTTON_STYLE, BUTTON_STYLE]}
                        onClick={this.props.onClose}
                    >
                        Got it
                    </button>
                </div>
            </div>
        );
    }
}

const VIEW_STYLE = {
    width: '100%',
    height: '100%',
};

const TITLE_STYLE: React.CSSProperties = {
    maxWidth: 520,
    fontSize: 32,
    lineHeight: 1.1,
    letterSpacing: -0.5,
    fontWeight: CommonStyles.FONT_WEIGHT_LIGHT,
    color: CommonStyles.MASALA_COLOR,
    textAlign: 'center',
    margin: '0 16px 48px 16px',
};

const BUTTON_STYLE: React.CSSProperties = {
    textAlign: 'center',
    padding: '8px 22px',
    border: `1px solid ${CommonStyles.DUSTY_GRAY_COLOR}`,
    color: CommonStyles.DUSTY_GRAY_COLOR,
};

const CONTAINER_STYLE = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
};
