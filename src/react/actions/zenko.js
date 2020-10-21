// @flow

import type { DispatchFunction,
    GetStateFunction,
    SetZenkoClientAction,
    ThunkNonStatePromisedAction,
    ThunkStatePromisedAction,
    ZenkoErrorAction,
} from '../../types/actions';
import type { Marker,
    SearchBucketResp,
    SearchResultList,
    ZenkoClientError,
    ZenkoClient as ZenkoClientInterface,
    ZenkoErrorType } from '../../types/zenko';
import { networkEnd, networkStart } from './network';
import { getClients } from '../utils/actions';

export function zenkoClearError(): ZenkoClearAction {
    return {
        type: 'ZENKO_CLEAR_ERROR',
    };
}

export function zenkoHandleError(error: ZenkoClientError, target: string | null, type: ZenkoErrorType): ZenkoErrorAction {
    return {
        type: 'ZENKO_HANDLE_ERROR',
        errorMsg: error.message || null,
        errorCode: error.code || null,
        errorType: type,
        errorTarget: target,
    };
}

export function writeSearchListing(nextMarker: Marker, list: SearchResultList): ZenkoWriteSearchListAction {
    return {
        type: 'ZENKO_CLIENT_WRITE_SEARCH_LIST',
        nextMarker,
        list,
    };
}

export function appendSearchListing(nextMarker: Marker, list: SearchResultList): ZenkoAppendSearchListAction {
    return {
        type: 'ZENKO_CLIENT_APPEND_SEARCH_LIST',
        nextMarker,
        list,
    };
}

export function setZenkoClient(zenkoClient: ZenkoClientInterface): SetZenkoClientAction {
    return {
        type: 'SET_ZENKO_CLIENT',
        zenkoClient,
    };
}

function _isFolder(key: string): boolean {
    return key.substr(key.length - 1) === '/';
}

function _getSearchObjects(bucketName: string, query: string, marker?: Marker): ThunkStatePromisedAction {
    return (dispatch: DispatchFunction, getState: GetStateFunction) => {
        const { zenkoClient } = getClients(getState());
        const params = {
            Bucket: bucketName,
            Query: query,
            Marker: marker ? marker : (void 0),
        };
        dispatch(zenkoClearError());
        dispatch(networkStart('Searching objects'));
        return zenkoClient.searchBucket(params)
            .then(({ IsTruncated, NextMarker, Contents }: SearchBucketResp) => {
                const nextMarker = IsTruncated && NextMarker || null;
                const list = Contents;
                list.forEach(object => {
                    object.IsFolder = _isFolder(object.Key);
                    if (!object.IsFolder) {
                        object.SignedUrl = zenkoClient.getObjectSignedUrl(bucketName, object.Key);
                    }
                });
                if (marker) {
                    dispatch(appendSearchListing(nextMarker, list));
                } else {
                    dispatch(writeSearchListing(nextMarker, list));
                }
            })
            .catch(err => dispatch(zenkoHandleError(err, null, null)))
            .finally(() => dispatch(networkEnd()));
    };
}

export function newSearchListing(bucketName: string, query: string): ThunkNonStatePromisedAction {
    return (dispatch: DispatchFunction) => {
        dispatch(networkStart('Starting search'));
        return dispatch(_getSearchObjects(bucketName, query))
            .then(() => dispatch(networkEnd()));
    };
}

export function continueSearchListing(bucketName: string, query: string): ThunkStatePromisedAction {
    return (dispatch: DispatchFunction, getState: GetStateFunction) => {
        const { zenkoClient } = getClients(getState());
        const marker = zenkoClient.searchResults.nextMarker;

        if (!marker) {
            return Promise.resolve();
        }

        dispatch(networkStart('continue search'));
        return dispatch(_getSearchObjects(bucketName, query, marker))
            .then(() => dispatch(networkEnd()));
    };
}
