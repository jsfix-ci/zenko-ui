/* eslint-disable */
import S3Client from '../js/S3Client';
import type {
  CommonPrefix,
  RetentionMode,
  S3DeleteMarker,
  S3Version,
} from './s3';
export type Site = string;
export type Marker = null | string;
export type SearchParams = {
  readonly Bucket: string;
  readonly Query: string;
  readonly Marker?: string;
};
export type SearchVersionParams = {
  readonly Bucket: string;
  readonly Query: string;
  readonly KeyMarker?: string;
  readonly VersionIdMarker?: string;
};
export type SearchResult = {
  readonly Key: string;
  readonly LastModified: Date;
  readonly ETag: string;
  readonly Size: number;
  IsFolder: boolean;
  SignedUrl?: string;
  ObjectRetention?: {
    Mode: RetentionMode;
    RetainUntilDate: Date;
  };
  IsLegalHoldEnabled?: boolean;
};
export type SearchResultList = Array<SearchResult>;
export type SearchBucketResp = {
  IsTruncated?: boolean;
  NextMarker?: Marker;
  Contents: SearchResultList;
};
export type SearchBucketVersionsResp = {
  readonly IsTruncated?: boolean;
  readonly NextKeyMarker?: Marker;
  readonly NextVersionIdMarker?: Marker;
  readonly Version: Array<S3Version>;
  readonly DeleteMarker: Array<S3DeleteMarker>;
  readonly commonPrefixes: CommonPrefix;
  readonly Prefix: string;
};
export type Credentials = {
  readonly accessKey: string;
  readonly secretKey: string;
  readonly sessionToken?: string;
};
export interface ZenkoClientError extends Error {
  code?: string | number;
}
export type ConnectionResp = void | ZenkoClientError;
export type ZenkoMapResp = {};
export type ZenkoErrorType = 'ingestion' | 'replication' | 'failed' | null;
export interface ZenkoClient extends S3Client {
  _init(): void;
  logout(): void;
  login(params: Credentials): void;
  searchBucket(params: SearchParams): Promise<SearchBucketResp>;
}
