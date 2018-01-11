import * as Radium from 'radium';
import * as React from 'react';

@Radium
export class ProgressLogo extends React.Component<React.HTMLAttributes<HTMLDivElement>> {
    render() {
        return (
            <div {...this.props}>
                <div style={[LOGO_CIRCLE_STYLE, LOGO_TOP_STYLE]}></div>
                <div style={[LOGO_CIRCLE_STYLE, LOGO_BOTTOM_STYLE]}></div>
            </div>
        );
    }
}

const LOGO_CIRCLE_STYLE: React.CSSProperties = {
    width: '73%',
    height: '73%',
    position: 'relative',
    borderRadius: '100%',
    mixBlendMode: 'multiply',
};

const LOGO_TOP_KEYFRAME_NAME = Radium.keyframes({
  '0%': { left: '27%', top: '0%', },
  '25%': { left: '27%', top: '27%', },
  '50%': { left: '0%', top: '27%', },
  '75%': { left: '0%', top: '0%', },
  '100%': { left: '27%', top: '0%', },
});

const LOGO_TOP_STYLE: React.CSSProperties = {
    backgroundColor: '#FF27FF',
    animation: '1.5s _placeholder_ infinite ease-in-out',
    animationName: LOGO_TOP_KEYFRAME_NAME,
    left: '27%',
};

const LOGO_BOTTOM_KEYFRAME_NAME = Radium.keyframes({
  '0%': { left: '0', top: '-46%', },
  '25%': { left: '0', top: '-73%', },
  '50%': { left: '27%', top: '-73%', },
  '75%': { left: '27%', top: '-46%', },
  '100%': { left: '0', top: '-46%', },
});

const LOGO_BOTTOM_STYLE: React.CSSProperties = {
    backgroundColor: '#00d800',
    animation: '1.5s _placeholder_ infinite ease-in-out',
    animationName: LOGO_BOTTOM_KEYFRAME_NAME,
    top: '-46%',
};
