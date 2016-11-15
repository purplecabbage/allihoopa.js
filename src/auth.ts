import { getApplicationIdentifier, getWebDomain } from './config';
import { clearCookie, getCookie, setPersistentCookie } from './cookie';

export type AuthCallback = (successful: boolean) => void;

/**
 * Open an authentication window for Allihoopa. The callback will be called with
 * `true` if the user successfully logged in, or `false` if the user cancelled
 * login by e.g. closing the window.
 */
export function authenticate(callback: AuthCallback) {
    clearCookie(getAuthCookieName());

    const popup = window.open(
        `https://${getWebDomain()}/account/login?response_type=token&client_id=${getApplicationIdentifier()}&redirect_type=postmessage`,
        'allihoopa_auth',
        'width=420,height=600');

    if (!popup) {
        console.warn('[Allihoopa SDK] Could not open the popup window');

        if (callback) {
            callback(false);
        }
        return;
    }

    let eventListener: (event: Event) => void;
    let pollTimer: number;
    let callbackFired = false;

    const cleanupListeners = () => {
        window.removeEventListener('message', eventListener);
        window.clearInterval(pollTimer);
    };

    const callCallback = (value: boolean) => {
        if (!callbackFired) {
            callbackFired = true;

            if (callback) {
                callback(value);
            }
        }
    };

    eventListener = (event: MessageEvent) => {
        if (event.data.substr(0, 10) === 'allihoopa:') {
            saveAuthCookie(event.data.substr(10));

            cleanupListeners();
            callCallback(true);
        }
    };

    pollTimer = window.setInterval(() => {
        if (popup.closed) {
            // There is a possible race condition where the window might close
            // itself *before* the postMessage arrives.
            //
            // This setInterval gives the message 100ms to arrive before
            // considering the auth cancelled.
            setInterval(() => {
                cleanupListeners();
                callCallback(false);
            }, 100);
        }
    }, 100);

    window.addEventListener('message', eventListener, false);
}

function getAuthCookieName() {
    return `ah-auth-${getApplicationIdentifier()}`;
}

function saveAuthCookie(data: string) {
    setPersistentCookie(getAuthCookieName(), data);
}

export function getAuthCookie(): string | null {
    return getCookie(getAuthCookieName());
}
