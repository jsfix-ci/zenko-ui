// @noflow
import { List, Map } from 'immutable';

export const initialAuthState = {isUserLoaded: false, configFailure: false};

export const initialBucketState = { list: []};
export const initialBucketUIState = { showDelete: false };

export const initialConfiguration: ConfigurationState = {
    latest: {
        version: 1,
        updatedAt: '2017-09-28T19:39:22.191Z',
        creator: 'initial',
        instanceId: 'demo-instance',
        locations: {},
        replicationStreams: [],
        users: [],
        endpoints: [],
        workflows: {
            lifecycle: {},
            transition: {},
        },
    },
};

export const initialErrorsUIState = { errorMsg: null, errorType: null };
export const initialInstancesState = {};
export const initialInstanceStatus: InstanceStatusState = {
    latest: {
        state: {
            capabilities: {
                secureChannel: true,
            },
            lastSeen: '',
            latestConfigurationOverlay: initialConfiguration.latest,
            serverVersion: '',
        },
        metrics: {
            'item-counts': {
                dataManaged: {
                    total: {
                        curr: 0,
                        prev: 0,
                    },
                    byLocation: {},
                },
                bucketList: [],
                buckets: 0,
                versions: 0,
                objects: 0,
            },
            'data-disk-usage': {
                available: 0,
                total: 0,
                free: 0,
            },
            'cpu': {
                idle: 0,
                nice: 0,
                sys: 0,
                user: 0,
            },
            'memory': {
                free: 0,
                total: 0,
            },
            'crr-stats': {
                backlog: {
                    count: 0,
                    size: 0,
                },
                completions: {
                    count: 0,
                    size: 0,
                },
                throughput: {
                    count: 0,
                    size: 0,
                },
                failures: {
                    count: 0,
                    size: 0,
                },
                pending: {
                    count: 0,
                    size: 0,
                },
                stalled: { count: 0 },
                byLocation: {},
            },
            'crr-schedule': {
                states: {},
                schedules: {},
            },
            'ingest-schedule': {
                states: {},
                schedules: {},
            },
        },
    },
};
export const initialLocationsUIState = { showDeleteLocation: false };
export const initialNetworkActivityState = {counter: 0, messages: List()};
export const initialSecretsState = Map();
export const initialStatsState = {};
export const initialUserUIState = { showDelete: false, showSecret: null, showDeleteKey: null };
export const initialUserState = {
    list: [],
    accessKeyList: [],
    attachedPoliciesList: [],
    groupList: [],
    displayedUser: {},
};

export const initialFullState = {
    auth: initialAuthState,
    configuration: initialConfiguration,
    instanceStatus: initialInstanceStatus,
    instances: initialInstancesState,
    networkActivity: initialNetworkActivityState,
    secrets: initialSecretsState,
    stats: initialStatsState,
    uiUser: initialUserUIState,
    uiLocations: initialLocationsUIState,
    uiErrors: initialErrorsUIState,
    uiBucket: initialBucketUIState,
    user: initialUserState,
};
