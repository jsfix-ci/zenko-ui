// @flow
import { Map } from 'immutable';

export interface S3Client {

}

export type CreateBucketRequest = {|
    +name: string,
    +locationContraint: string,
|};

export type HeadObjectResponse = {|
    +LastModified: string,
    +ContentLength: number,
    +ContentType: string,
    +ETag: string,
    +VersionId: string,
    +Metadata: { [string]: string },
|};

export type S3Bucket = {|
    +CreationDate: string,
    +Name: string,
|};

export type S3Object = {|
    +Key: string,
    +LastModified: string,
    +Size: number,
    +SignedUrl?: string,
|};

export type CommonPrefix = {|
    +Prefix: string,
|};

export type Object = {|
    +name: string,
    +lastModified?: string,
    +isFolder: string,
    +size: number,
    +toggled: boolean,
    +signedUrl?: string,
|};

export type File = {|
    +path: string,
    +size: number,
|};

export type CreateBucketResponse = {|
    +Location: string,
|};

export type MetadataItem = {
    key: string,
    value: string,
    metaKey: string,
};

export type MetadataItems = Array<MetadataItem>;

export type ObjectMetadata = {|
    +bucketName: string,
    +prefixWithSlash: string,
    +objectKey: string,
    +objectName: string,
    +lastModified: string,
    +contentLength: number,
    +contentType: string,
    +eTag: string,
    +versionId: string,
    +metadata: MetadataItems,
|};
