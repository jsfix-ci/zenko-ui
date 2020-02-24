export function errorParser(error) {
    let message = '';
    //! $FlowFixMe
    if (error.response && error.response.body && error.response.body.message) {
        message = error.response.body.message;
    //! $FlowFixMe
    } else if (error.message) {
        message = error.message;
    } else if (error.status === 401) {
        message = 'The request is missing valid authentication credentials.';
    } else if (error.status === 403) {
        message = 'Access to the requested item was denied.';
    } else if (error.status === 404) {
        message = 'The requested item does not exist.';
    } else if (error.status === 409) {
        message = 'An item with the same identifier already exists.';
    } else if (error.status === 500 || error.status === 503) {
        message = 'The server is temporarily unavailable.';
    } else {
        message = `Failed with error status: ${String(error.status)}`;
    }
    return { message };
}
