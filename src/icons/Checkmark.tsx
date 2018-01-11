import * as Radium from 'radium';
import * as React from 'react';

@Radium
export class Checkmark extends React.Component<React.HTMLAttributes<SVGElement>> {
    render(): JSX.Element {
        return (
            <svg
                viewBox='0 0 41 41'
                version='1.1'
                xmlns='http://www.w3.org/2000/svg'
                {...this.props}
            >
                <g
                    stroke='none'
                    strokeWidth='1'
                    fill='none'
                    fillRule='evenodd'
                >
                    <g>
                        <circle
                            fill='#28DC28'
                            cx='20.5'
                            cy='20.5'
                            r='20.5' />
                        <polyline
                            stroke='#FFFFFF'
                            strokeWidth='3'
                            points='9.97297297 20.9443547 17.7845794 28.7559611 31.027027 15.5135135' />
                    </g>
                </g>
            </svg>
        );
    }
}
