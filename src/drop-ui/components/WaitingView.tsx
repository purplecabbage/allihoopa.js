import * as Radium from 'radium';
import * as React from 'react';

import * as CommonStyles from '../styles/CommonStyles';

import {ProgressLogo} from '../../icons/ProgressLogo';

@Radium
export class WaitingView extends React.Component<void, void> {
    render() {
        return (
            <div style={[CommonStyles.CENTERED_CONTAINER_STYLE, CONTAINER_STYLE]}>
                <ProgressLogo style={PROGRESS_LOGO} />
                <p style={TITLE_STYLE}>Dropping your piece to&nbsp;Allihoopa…</p>

                <div style={WARNING_STYLE}>Don't close this screen or you can kiss your piece bye bye</div>
            </div>
        );
    }
}

const CONTAINER_STYLE: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',
};

const PROGRESS_LOGO: React.CSSProperties = {
    width: 41,
    height: 41,

    [CommonStyles.MQ_MIN_WIDTH_SMALL]: {
        width: 50,
        height: 50,
    },
};

const TITLE_STYLE: React.CSSProperties = {
    fontSize: 28,
    lineHeight: 1.3,
    letterSpacing: -0.4,
    fontWeight: CommonStyles.FONT_WEIGHT_LIGHT,
    textAlign: 'center',
    color: CommonStyles.MASALA_COLOR,

    [CommonStyles.MQ_MIN_WIDTH_SMALL]: {
        maxWidth: 350,
    },
};

const WARNING_STYLE: React.CSSProperties = {
    position: 'fixed',
    bottom: 22,
    width: '80%',
    left: '10%',
    opacity: 0.93,
    fontSize: 11,
    lineHeight: 1.2,
    color: CommonStyles.MASALA_COLOR,
    padding: '12px 50px',
    boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.13)',
    border: '1px solid rgba(0, 0, 0, 0.09)',
    textAlign: 'center',

    [CommonStyles.MQ_MIN_WIDTH_SMALL]: {
        width: 300,
        left: '50%',
        marginLeft: -150,
    },
};
