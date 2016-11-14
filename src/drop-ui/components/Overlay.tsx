import {StyleRoot} from 'radium';
import * as React from 'react';

import * as CommonStyles from '../styles/CommonStyles';

const Frame = require('react-frame-component');

export class Overlay extends React.Component<void, void> {
    render() {
        return (
            <Frame
                initialContent={INITIAL_CONTENT}
                style={IFRAME_STYLE}
            >
                <StyleRoot>
                    <div style={[OVERLAY_STYLE, CommonStyles.CENTERED_CONTAINER_STYLE]}>
                        <div style={CONTAINER_STYLE}>
                            {this.props.children}
                        </div>
                    </div>
                </StyleRoot>
            </Frame>
        );
    }
}

const IFRAME_STYLE = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    border: 0,
};

const OVERLAY_STYLE = {
    background: '#fff',
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
};

const CONTAINER_STYLE = {
    background: '#fff',
    textAlign: 'left',
    maxWidth: '740px',
    width: '100%',
    height: '100%',
    WebkitOverflowScrolling: 'touch',
    padding: '16px',
    fontFamily: CommonStyles.FONT_STACK,
};

const INITIAL_CONTENT = `
<!DOCTYPE html>
<html>
<head>
    <style>html, body { padding: 0, margin: 0} * { box-sizing: border-box }</style>
    <script>
        (function(d) {
            var config = {
                kitId: 'yyu2tiq',
                scriptTimeout: 3000,
                async: true
            },
            h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\bwf-loading\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)
        })(document);
    </script>
</head>
<body><div></div></body>
</html>
`;
