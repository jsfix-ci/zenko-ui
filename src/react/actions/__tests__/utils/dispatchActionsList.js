// @flow

import {
    APP_CONFIG,
    INSTANCE_ID,
} from './testUtil';

import type {
    ConfigAuthFailureAction,
    HandleErrorAction,
    InitClientsAction,
    LoadUserSuccessAction,
    NetworkActivityAuthFailureAction,
    SelectInstanceAction,
    SetAppConfigAction,
    SetUserManagerAction,
    SignoutEndAction,
    SignoutStartAction,
} from '../../../../types/actions';

import { CALL_HISTORY_METHOD } from 'connected-react-router';

import { MockManagementClient } from '../../../../js/mock/managementClient';
import { MockS3Client } from '../../../../js/mock/s3Client';
import { MockUserManager } from '../../../../js/mock/userManager';

// auth actions
export const INIT_CLIENTS_ACTION: InitClientsAction =
    { type: 'INIT_CLIENTS', managementClient: new MockManagementClient(), s3Client: new MockS3Client() };

export const SET_USER_MANAGER_ACTION: SetUserManagerAction =
    { type: 'SET_USER_MANAGER', userManager: new MockUserManager() };

export const SET_APP_CONFIG_ACTION: SetAppConfigAction =
    { type: 'SET_APP_CONFIG', config: APP_CONFIG };

export const SELECT_INSTANCE_ACTION: SelectInstanceAction =
    { type: 'SELECT_INSTANCE', selectedId: INSTANCE_ID };

export const LOAD_USER_SUCCESS_ACTION: LoadUserSuccessAction =
    { type: 'LOAD_USER_SUCCESS' };

export const CONFIG_AUTH_FAILURE_ACTION: ConfigAuthFailureAction =
    { type: 'CONFIG_AUTH_FAILURE' };

export const SIGNOUT_START_ACTION: SignoutStartAction =
    { type: 'SIGNOUT_START' };

export const SIGNOUT_END_ACTION: SignoutEndAction =
    { type: 'SIGNOUT_END' };

export function HANDLE_ERROR_AUTH_ACTION(errorMsg: string): HandleErrorAction {
    return { type: 'HANDLE_ERROR', errorMsg, errorType: 'byAuth' };
}

export const NETWORK_AUTH_FAILURE_ACTION: NetworkActivityAuthFailureAction =
    { type: 'NETWORK_AUTH_FAILURE' };

export const LOCATION_PUSH_ACTION = (path: string) => ({
    type: CALL_HISTORY_METHOD, payload: { args: [path], method: 'push' },
});
