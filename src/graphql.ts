import {getAuthCookie} from './auth';
import {getAPIDomain, getAPIKey} from './config';

export type Result<T>
    = { status: 'OK', data: T }
    | { status: 'ERROR', error: Error };

export type ResultCallback<T> = (result: Result<T>) => void;

export function graphQLQuery<T>(
    query: string,
    variables: {[key: string]: any},
    callback: ResultCallback<T>,
) {
    const url = `https://${getAPIDomain()}/v1/graphql`;

    let xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.responseType = 'json';
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Allihoopa-API-Key', getAPIKey());

    const authCookie = getAuthCookie();
    if (authCookie) {
        const accessToken = JSON.parse(authCookie);
        xhr.setRequestHeader('ph-access-token', accessToken.access_token);
    }

    xhr.onload = () => {
        if (xhr.status === 200) {
            let response = xhr.response;
            // IE special handling
            if (typeof response === 'string') {
                response = JSON.parse(response);
            }
            callback({ status: 'OK', data: response.data });
        } else {
            callback({ status: 'ERROR', error: new Error(xhr.response) });
        }
    };

    xhr.send(JSON.stringify({ query, variables }));
}
