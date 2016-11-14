import * as Radium from 'radium';
import * as React from 'react';

import {graphQLQuery} from '../../../graphql';

import {AllihoopaLogo} from '../../../icons/AllihoopaLogo';

import * as CommonStyles from '../../styles/CommonStyles';

export interface TitleProps {
    onClose: () => void;
}

export interface TitleState {
    profile: { url: string; image: string; username: string; } | null;
}

interface ProfileData {
    me: {
        username: string,
        profileUrl: string,
        profileImage: {
            url: string;
        };
    } | null;
}

@Radium
export class Title extends React.Component<TitleProps, TitleState> {
    constructor(props: TitleProps) {
        super(props);

        this.state = {
            profile: null,
        };
    }

    componentWillMount() {
        graphQLQuery<ProfileData>(
            `{
                me {
                    username
                    profileUrl
                    profileImage(position: 30 withFallback: true) {
                        url
                    }
                }
            }`,
            {},
            (result) => {
                if (result.status === 'OK' && result.data.me) {
                    this.setState({
                        profile: {
                            url: result.data.me.profileUrl,
                            image: result.data.me.profileImage.url,
                            username: result.data.me.username,
                        },
                    } as TitleState);
                }
            });
    }

    render(): JSX.Element {
        return (
            <div
                style={CONTAINER_STYLE}
            >
                <button
                    style={[CommonStyles.FLAT_BUTTON_STYLE, CANCEL_BUTTON_STYLE]}
                    onClick={this.props.onClose}
                >
                    Cancel
                </button>
                {this.renderProfileButton()}
                <div
                    style={HEADER_CONTAINER_STYLE}
                >
                    <AllihoopaLogo
                        style={LOGO_STYLE}
                    />
                    <div
                        style={HEADER_STYLE}
                    >
                        Drop to Allihoopa
                    </div>
                </div>
            </div>
        );
    }

    renderProfileButton(): JSX.Element | null {
        if (!this.state.profile) {
            return null;
        }

        return (
            <a
                href={this.state.profile.url}
                target='_blank'
                style={PROFILE_IMAGE_STYLE}
                title={`Logged in as ${this.state.profile.username}`}
            >
                <img
                    style={PROFILE_IMAGE_STYLE}
                    src={this.state.profile.image}
                />
            </a>
        );
    }
}

const CONTAINER_STYLE: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 36,

    [CommonStyles.MQ_MIN_WIDTH_SMALL]: {
        flexDirection: 'row-reverse',
        flexWrap: 'nowrap',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 50,
    },
};

const HEADER_CONTAINER_STYLE: React.CSSProperties = {
    flexBasis: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 14,

    [CommonStyles.MQ_MIN_WIDTH_SMALL]: {
        flexDirection: 'row',
        marginTop: 0,
    },
};

const CANCEL_BUTTON_STYLE: React.CSSProperties = {
    color: CommonStyles.DUSTY_GRAY_COLOR,
    cursor: 'pointer',
    paddingLeft: 0,

    [CommonStyles.MQ_MIN_WIDTH_SMALL]: {
        display: 'none',
    },
};

const PROFILE_IMAGE_STYLE: React.CSSProperties = {
    width: 36,
    height: 36,
    borderRadius: '100%',
};

const LOGO_STYLE: React.CSSProperties = {
    width: 36,
    height: 36,
};

const HEADER_STYLE: React.CSSProperties = {
    fontWeight: CommonStyles.FONT_WEIGHT_LIGHT,
    fontSize: 28,
    letterSpacing: -0.4,
    color: CommonStyles.MASALA_COLOR,

    [CommonStyles.MQ_MIN_WIDTH_SMALL]: {
        fontSize: 40,
        letterSpacing: -0.7,
        margin: '0 0 4px 16px',
    },
};
