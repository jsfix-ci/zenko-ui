// @noflow
import { ErrorMockS3Client, MockS3Client } from './S3Client';
import type {
    SearchBucketResp,
    ZenkoClient as ZenkoClientInterface,
} from '../types/zenkoClient';
import { ApiErrorObject } from './error';

export class MockZenkoClient extends MockS3Client implements ZenkoClientInterface {
    _init(): void {}
    logout(): void {}
    login(): void {}
    searchResults: {};

    constructor() {
        super();
        this.searchResults = {
            nextMarker: 'marker',
        };
    }

    searchBucket(): Promise<SearchBucketResp> {
        return Promise.resolve({ IsTruncated: false, Contents: [] });
    }
}

export class ErrorMockZenkoClient extends ErrorMockS3Client implements ZenkoClientInterface {
    _error: ApiErrorObject;
    searchResults: {};

    constructor(error: ApiErrorObject) {
        super(error);
        this._error = error;
        this.searchResults = {
            nextMarker: 'marker',
        };
    }

    searchBucket(): Promise<void> {
        return Promise.reject(this._error);
    }
}
