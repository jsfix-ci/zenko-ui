import { handleApiError, handleClientError } from './error';

function updateBucketList(list) {
    return {
        type: 'UPDATE_BUCKET_LIST',
        list,
    };
}

export function listBuckets(){
    return (dispatch, getState) => {
        const client = getState().s3Client.client;
        return client.listBucketsWithLocation()
            .then(res => dispatch(updateBucketList(res.Buckets)))
            .catch(error => dispatch(handleClientError(error)))
            .catch(error => dispatch(handleApiError(error, 'byModal')));
    };
}
