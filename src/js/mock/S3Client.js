// @flow

import type {
    BucketInfo,
    CreateBucketResponse,
    GetObjectTaggingResponse,
    GetSignedUrlResponse,
    HeadObjectResponse,
    ListObjectsResponse,
    PutObjectTaggingResponse,
    S3Client as S3ClientInterface,
} from '../../types/s3';
import { ApiErrorObject } from './error';
import { addTrailingSlash } from '../../react/utils';

export const ownerName = 'bart';
export const bucketName = 'bucket';
export const fileName = 'file';
export const folderName = 'folder';
export const prefix = 'toto/';
export const objectKey = 'toto/foo.jpg';
export const objectKey2 = 'test/tags.jpg';
export const commonPrefix = {
    Prefix: prefix,
};
export const nextContinuationToken = 'next';
export const s3Object = {
    Key: addTrailingSlash(folderName),
    LastModified: 'Wed Oct 07 2020 16:35:57',
    Size: 0,
    SignedUrl: '',
};

export const objectMetadata = {
    bucketName: bucketName,
    contentLength: 4529171,
    contentType: 'image/jpeg',
    eTag: 'af4a08eac69ced858c99caee22978773',
    lastModified: 'Fri Oct 16 2020 10:06:54',
    metadata: [],
    objectKey: 'bg.jpg',
    objectName: 'bg.jpg',
    prefixWithSlash: '',
    versionId: '',
    tags: [],
};

export const tags = [
    { Key: 'key1', Value: 'value1' },
];

export const createBucketResponse: CreateBucketResponse = {
    Location: '',
};
export const file = {
    path: '',
    size: 0,
};

export const getSignedUrlResponse: GetSignedUrlResponse = '';

export const listObjectsResponse = (prefixWithSlash: string): ListObjectsResponse => ({
    CommonPrefixes: [commonPrefix],
    Contents: [s3Object],
    ContinuationToken: '',
    Delimiter: '',
    EncodingType: '',
    IsTruncated: false,
    KeyCount: 0,
    MaxKeys: 0,
    Name: '',
    NextContinuationToken: nextContinuationToken,
    Prefix: prefixWithSlash,
    StartAfter: '',
});

export const userMetadata = {
    'color': 'green',
};

export const systemMetadata = {
    ContentType: 'application/octet-stream; charset=UTF-8',
};

export const info = {
    LastModified: 'Wed Oct 14 2020 15:58:52',
    ContentLength: 1400,
    ContentType: 'image/jpeg',
    ETag: '123456789',
    VersionId: '1',
    Metadata: userMetadata,
};

export const putObjectTaggingResponse: PutObjectTaggingResponse = {
    VersionId: '1',
};

const bucketInfoResponse: BucketInfo = {
    name: bucketName,
    policy: false,
    owner: '',
    aclGrantees: 0,
    cors: false,
    versioning: 'Suspended',
    isVersioning: false,
    public: false,
    locationConstraint: '',
};

export class MockS3Client implements S3ClientInterface {
    listBucketsWithLocation() {
        return Promise.resolve({
            Buckets: [],
            Owner: {
                DisplayName: ownerName,
                ID: 'id1',
            },
        });
    }

    createBucket(): Promise<CreateBucketResponse> {
        return Promise.resolve(createBucketResponse);
    }

    deleteBucket(): Promise<void> {
        return Promise.resolve();
    }

    createFolder(): Promise<void> {
        return Promise.resolve();
    }

    listObjects({ Prefix }: { Prefix: string }): Promise<ListObjectsResponse> {
        return Promise.resolve(listObjectsResponse(Prefix));
    }

    getObjectSignedUrl(): Promise<GetSignedUrlResponse> {
        return Promise.resolve(getSignedUrlResponse);
    }

    uploadObject(): Promise<void> {
        return Promise.resolve();
    }

    deleteObjects(): Promise<void> {
        return Promise.resolve();
    }

    headObject(): Promise<HeadObjectResponse> {
        return Promise.resolve(info);
    }

    getObjectTagging(bucketName: string, objectKey: string): Promise<GetObjectTaggingResponse> {
        return Promise.resolve({ TagSet: bucketName === 'bucket' && objectKey === objectKey2 ? tags : [] });
    }

    putObjectMetadata(): Promise<void> {
        return Promise.resolve();
    }

    putObjectTagging(): Promise<PutObjectTaggingResponse> {
        return Promise.resolve(putObjectTaggingResponse);
    }

    getBucketInfo(): Promise<BucketInfo> {
        return Promise.resolve(bucketInfoResponse);
    }
}

export class ErrorMockS3Client implements S3ClientInterface {
    _error: ApiErrorObject;

    constructor(error: ApiErrorObject) {
        this._error = error;
    }

    createBucket(): Promise<void> {
        return Promise.reject(this._error);
    }

    listBucketsWithLocation(): Promise<void> {
        return Promise.reject(this._error);
    }

    deleteBucket(): Promise<void> {
        return Promise.reject(this._error);
    }

    createFolder(): Promise<void> {
        return Promise.reject(this._error);
    }

    listObjects(): Promise<void> {
        return Promise.reject(this._error);
    }

    getObjectSignedUrl(): Promise<void> {
        return Promise.reject(this._error);
    }

    uploadObject(): Promise<void> {
        return Promise.reject(this._error);
    }

    deleteObjects(): Promise<void> {
        return Promise.reject(this._error);
    }

    headObject(): Promise<void> {
        return Promise.reject(this._error);
    }

    getObjectTagging(): Promise<void> {
        return Promise.reject(this._error);
    }

    putObjectMetadata(): Promise<void> {
        return Promise.reject(this._error);
    }

    putObjectTagging(): Promise<void> {
        return Promise.reject(this._error);
    }

    bucketInfo(): Promise<void> {
        return Promise.reject(this._error);
    }
}
