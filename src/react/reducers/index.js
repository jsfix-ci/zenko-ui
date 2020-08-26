import auth from './auth';
import bucket from './bucket';
import { combineReducers } from 'redux';
import configuration from './configuration';
import { connectRouter } from 'connected-react-router';
import instanceStatus from './instanceStatus';
import instances from './instances';
import networkActivity from './networkActivity';
import { reducer as oidcReducer } from 'redux-oidc';
import secrets from './secrets';
import stats from './stats';
import uiAccounts from './uiAccounts';
import uiBucket from './uiBucket';
import uiErrors from './uiErrors';
import uiLocations from './uiLocations';
import uiUser from './uiUser';
import user from './user';

const zenkoUIReducer = history => combineReducers({
    auth,
    bucket,
    configuration,
    user,
    instanceStatus,
    instances,
    networkActivity,
    uiAccounts,
    uiBucket,
    uiErrors,
    uiLocations,
    uiUser,
    secrets,
    stats,
    oidc: oidcReducer,
    router: connectRouter(history),
});

export default zenkoUIReducer;
