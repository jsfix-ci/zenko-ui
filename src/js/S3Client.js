import AWS from 'aws-sdk';
const async = require('async');

export default class S3Client {
    constructor(creds) {
        this.client = new AWS.S3({
            // endpoint: 'https://s3.amazonaws.com',
            endpoint: 'http://127.0.0.1:8383/s3',
            accessKeyId: creds.accessKey,
            secretAccessKey: creds.secretKey,
            region: 'us-east-1',
            s3ForcePathStyle: true,
        });
    }

    listBuckets() {
        return this.client.listBuckets().promise();
        // return new Promise(resolve => {
        //     return resolve({Buckets: [
        //         { Name: 'scalitybucketoregon'},
        //         { Name: 'scalitybucketireland6'},
        //     ]});
        // });
    }

    listBucketsWithLocation() {
        return new Promise((resolve, reject) => {
            this.client.listBuckets((error, list) => {
                if (error) {
                    return reject(error);
                }
                return async.eachOf(list.Buckets, (bucket, key, cb) => {
                    return this.client.getBucketLocation({ Bucket: bucket.Name },
                        (error, data) => {
                            if (error) {
                                return cb(error);
                            }
                            list.Buckets[key].LocationConstraint =
                            data.LocationConstraint;
                            return cb(null);
                        });
                }, err => err ? reject(error) : resolve(list));
            });
        });
    }

    createBucket(newBucket) {
        const params = {
            Bucket: newBucket.name,
            CreateBucketConfiguration: {
                LocationConstraint: newBucket.locationConstraint,
            },
        };
        return this.client.createBucket(params).promise();
    }

}
