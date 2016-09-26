import * as React from 'react';
import * as Radium from 'radium';

export interface ToggleProps {
    enabledTitle: string;
    disabledTitle: string;
    value: boolean;
    onChange: () => void;
}

@Radium
export default class Toggle extends React.Component<ToggleProps, {}> {

    render() {
        return (
            <span style={[styles.toggleContainer]}>
                <a
                    href='#'
                    onClick={this.props.onChange}>
                    { this.props.value ?
                        <svg  style={[styles.toggleImage]} fill='#000000' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'>
                            <path d='M0 0h24v24H0z' fill='none'/>
                            <path d='M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'/>
                        </svg> :
                        <svg style={[styles.toggleImage]} fill='#000000' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'>
                            <path d='M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z'/>
                            <path d='M0 0h24v24H0z' fill='none'/>
                        </svg>
                    }
                </a>
                <span style={[styles.toggleLabel]}>{ this.props.value ? this.props.enabledTitle : this.props.disabledTitle }</span>
            </span>
        );
    }
}

const styles = {
    toggleContainer: {
        height: '24px'
    },
    toggleImage: {
        marginTop: '-3px'
    },
    toggleLabel: {
        verticalAlign: 'top',
        marginLeft: '8px'
    }
};