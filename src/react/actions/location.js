// @noflow
import { handleApiError, handleClientError } from './error';
import { networkEnd, networkStart } from './network';
import { getClients } from '../utils/actions';
import { push } from 'connected-react-router';
import { updateConfiguration } from './configuration';

export function selectLocation(locationName) {
    return {
        type: 'SELECT_LOCATION',
        locationName,
    };
}

export function resetSelectLocation() {
    return {
        type: 'RESET_SELECT_LOCATION',
    };
}

export function openLocationDeleteDialog() {
    return {
        type: 'OPEN_LOCATION_DELETE_DIALOG',
    };
}

export function closeLocationDeleteDialog() {
    return {
        type: 'CLOSE_LOCATION_DELETE_DIALOG',
    };
}

export function saveLocation(location: Location): ThunkStatePromisedAction {
    return (dispatch, getState) => {
        const { pensieveClient, instanceId } = getClients(getState());
        const params = {
            uuid: instanceId,
            location,
            locationName: location.name,
        };

        dispatch(networkStart('Saving Location'));
        const op = location.objectId ?
            pensieveClient.updateConfigurationOverlayLocation(params)
            :
            pensieveClient.createConfigurationOverlayLocation(params);
        return op.then(() => {
            dispatch(updateConfiguration());
            dispatch(push('/'));
        }).catch(error => dispatch(handleClientError(error)))
            .catch(error => dispatch(handleApiError(error, 'byModal')))
            .finally(() => dispatch(networkEnd()));
    };
}

export function deleteLocation(locationName: LocationName): ThunkStatePromisedAction {
    return (dispatch, getState) => {
        const { pensieveClient, instanceId } = getClients(getState());
        const params = {
            uuid: instanceId,
            locationName,
        };

        dispatch(resetSelectLocation());
        dispatch(networkStart('Deleting Location'));
        return pensieveClient.deleteConfigurationOverlayLocation(params)
            .then(() => {
                dispatch(updateConfiguration());
                dispatch(closeLocationDeleteDialog());
            })
            .catch(error => dispatch(handleClientError(error)))
            .catch(error => dispatch(handleApiError(error, 'byModal')))
            .finally(() => dispatch(networkEnd()));
    };
}
