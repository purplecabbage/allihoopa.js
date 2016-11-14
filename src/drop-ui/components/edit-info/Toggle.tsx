import * as Radium from 'radium';
import * as React from 'react';

import * as CommonStyles from '../../styles/CommonStyles';

export interface ToggleProps {
    enabledTitle: string;
    disabledTitle: string;
    enabledDescription: string;
    disabledDescription: string;
    value: boolean;
    onChange: (value: boolean) => void;
}

@Radium
export class Toggle extends React.Component<ToggleProps, void> {
    render() {
        return (
            <div style={CONTAINER_STYLE}>
                <div
                    style={TOGGLE_STYLE}
                    onClick={() => this.props.onChange(!this.props.value)}
                >
                    <div style={DISABLED_TEXT_STYLE}>{this.props.disabledTitle}</div>
                    <div style={[BACKDROP_STYLE, this.props.value && BACKDROP_ENABLED_STYLE]}>
                        <div style={ENABLED_TEXT_STYLE}>{this.props.enabledTitle}</div>
                    </div>
                    <div style={[CIRCLE_STYLE, this.props.value && CIRCLE_ENABLED_STYLE]}></div>
                </div>

                <div style={DESCRIPTION_CONTAINER_STYLE}>
                    <div style={[DESCRIPTION_STYLE, {opacity: this.props.value ? 1 : 0}]}>{this.props.enabledDescription}</div>
                    <div style={[DESCRIPTION_STYLE, {opacity: this.props.value ? 0 : 1}]}>{this.props.disabledDescription}</div>
                </div>
            </div>
        );
    }
}

const CONTAINER_STYLE: React.CSSProperties = {
    display: 'flex',
};

const TOGGLE_STYLE: React.CSSProperties = {
    display: 'inline-block',
    position: 'relative',
    fontSize: 14,
    background: '#fff',
    borderRadius: 11,
    height: 22,
    padding: '1px 10px 2px',
    border: `1px solid ${CommonStyles.VIBRANT_GREEN_COLOR}`,
    MozUserSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none',
    cursor: 'default',
};

const DISABLED_TEXT_STYLE: React.CSSProperties = {
    color: CommonStyles.DUSTY_GRAY_COLOR,
    marginLeft: 16,
    marginTop: -2,
};

const ENABLED_TEXT_STYLE: React.CSSProperties = {
    color: '#fff',
    marginLeft: 16,
    marginTop: -1,
};

const BACKDROP_STYLE: React.CSSProperties = {
    backgroundColor: CommonStyles.VIBRANT_GREEN_COLOR,
    position: 'absolute',
    height: '100%',
    top: 0,
    left: 0,
    borderBottomLeftRadius: 11,
    borderTopLeftRadius: 11,
    width: 11,
    overflow: 'hidden',
    transition: 'width .12s ease-in-out',
};

const BACKDROP_ENABLED_STYLE: React.CSSProperties = {
    width: 'calc(100% - 11px)',
};

const CIRCLE_STYLE: React.CSSProperties = {
    position: 'absolute',
    left: -1,
    top: -1,
    width: 22,
    height: 22,
    backgroundColor: '#fff',
    border: '1px solid #29db29',
    borderRadius: '100%',
    transition: 'left .12s ease-in-out',
};

const CIRCLE_ENABLED_STYLE: React.CSSProperties = {
    left: 'calc(100% - 21px)',
};

const DESCRIPTION_CONTAINER_STYLE: React.CSSProperties = {
    marginLeft: 10,
    position: 'relative',
    flexGrow: 1,
};

const DESCRIPTION_STYLE: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    fontSize: 14,
    color: CommonStyles.DUSTY_GRAY_COLOR,
    transition: 'opacity .12s linear',
};
