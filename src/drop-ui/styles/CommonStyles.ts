export const FONT_STACK = 'sofia-pro, -apple-system, ".SFNSText-Regular", "San Francisco", Roboto, "Segoe UI", "Helvetica Neue", "Lucida Grande", sans-serif';

export const BRIGHT_MAGENTA_COLOR = '#ff27ff';
export const TURQUOISE_COLOR = '#23a6bd';
export const MASALA_COLOR = '#4A4A4A';
export const DUSTY_GRAY_COLOR = '#9B9B9B';
export const LINK_HOVER_COLOR = '#63a2ac';
export const VIBRANT_GREEN_COLOR = '#29DB29';
export const BUTTON_HOVER_COLOR = '#28d22c';

export const FONT_WEIGHT_LIGHT = 200;
export const FONT_WEIGHT_BOLD = 700;

export const MQ_MIN_WIDTH_SMALL = '@media (min-width: 768px)';
export const MQ_MAX_WIDTH_SMALL = '@media (max-width: 767px)';

export const CENTERED_CONTAINER_STYLE = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
};

export const INPUT_RESET_STYLE = {
    margin: 0,
    padding: 0,
    border: 0,
    verticalAlign: 'baseline',
    background: 'transparent',
    outline: 'none',
};

export const RESET_BUTTON_STYLE = {
    background: 'transparent',
    border: 0,
    boxShadow: 'none',
    outline: 'none',
};

export const FLAT_BUTTON_STYLE = {
    background: 'transparent',
    border: 0,
    boxShadow: 'none',
    outline: 'none',
    textTransform: 'uppercase',
    fontFamily: FONT_STACK,
    fontSize: 14,
    letterSpacing: 1.2,
    lineHeight: '20px',
};

export const HIDDEN_XS = {
    [MQ_MAX_WIDTH_SMALL]: {
        display: 'none',
    },
};

export const HIDDEN_SM = {
    [MQ_MIN_WIDTH_SMALL]: {
        display: 'none',
    },
};
