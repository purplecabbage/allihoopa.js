import * as React from 'react';

export class DefaultCover extends React.Component<React.HTMLAttributes<SVGElement>> {
    render() {
        return (
            <svg
                viewBox='0 0 288 288'
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
                    <rect x='0' y='0' width='288' height='288' fill='#A7DBD8' />
                    <g transform='translate(36.000000, 19.080000)'>
                        <ellipse
                            id='Oval-5'
                            fillOpacity='0.401834239'
                            fill='#FF27FF'
                            cx='121.86'
                            cy='108.18'
                            rx='76.86'
                            ry='76.86' />
                        <circle
                            fillOpacity='0.395578578'
                            fill='#FFFFFF'
                            cx='180'
                            cy='47.88'
                            r='47.88' />
                        <circle
                            fillOpacity='0.6'
                            fill='#28DC28'
                            cx='23.4'
                            cy='212.04'
                            r='23.4' />
                    </g>
                </g>
            </svg>
        );
    }
}
