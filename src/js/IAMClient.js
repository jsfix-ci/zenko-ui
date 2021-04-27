// @noflow

import type { Credentials } from '../types/zenko';
import IAM from 'aws-sdk/clients/iam';
import type { IAMClient as IAMClientInterface } from '../types/iam';

export default class IAMClient implements IAMClientInterface {
    constructor(endpoint) {
        this.endpoint = endpoint;
    }

    login(creds: Credentials) {
        this.client = new IAM({
            // endpoint: 'https://iam.amazonaws.com',
            endpoint: this.endpoint,
            accessKeyId: creds.accessKey,
            secretAccessKey: creds.secretKey,
            sessionToken: creds.sessionToken,
            region: 'us-east-1',
        });
    }

    logout() {
        if (this.client)
            this.client.config.update({ accessKeyId: '', secretAccessKey: '', sessionToken: '' });
    }

    createAccessKey(userName) {
        return this.client.createAccessKey({
            UserName: userName,
        }).promise();
    }

    createUser(userName) {
        return this.client.createUser({
            UserName: userName,
        }).promise();
    }

    deleteAccessKey(accessKey, userName) {
        const params = {
            AccessKeyId: accessKey,
            UserName: userName,
        };
        return this.client.deleteAccessKey(params).promise();
    }

    deleteAccessKeys() {
        this.client.listAccessKeys().promise()
            .then(resp => {
                return Promise.all(resp.AccessKeyMetadata.map(ak => {
                    const params = {
                        AccessKeyId: ak.AccessKeyId,
                    };
                    return this.client.deleteAccessKey(params).promise();
                }));
            });
    }

    deleteUser(userName) {
        return this.client.deleteUser({
            UserName: userName,
        }).promise();
    }

    getUser(userName) {
        return this.client.getUser({
            UserName: userName,
        }).promise();
    }

    listOwnAccessKeys() {
        return this.client.listAccessKeys().promise();
    }

    listAccessKeys(userName) {
        return this.client.listAccessKeys({
            UserName: userName,
        }).promise();
    }

    listAttachedUserPolicies(userName) {
        return this.client.listAttachedUserPolicies({
            UserName: userName,
        }).promise();
    }

    listGroupsForUser(userName) {
        return this.client.listGroupsForUser({
            UserName: userName,
        }).promise();
    }

    listUsers() {
        return this.client.listUsers({
            MaxItems: 20,
        }).promise();
    }
}


// OFFLILE
// export default class IAMClient {
//     constructor() {
//         console.log('CALL constructor!!!');
//         this.users = [{
//             UserName: 'Alice',
//             Arn: 'arn:alice:bucket1:write:read:exec',
//             CreateDate: '2020-02-02',
//             UserId: '12331-13434-3413-4134-1434-134',
//         },{
//             UserName: 'Bob',
//             Arn: 'arn:bob:bucket2:write:read:exec',
//             CreateDate: '2019-02-03',
//             UserId: '22331-13434-3413-4134-1434-134',
//         }];
//     }
//
//     createUser(userName) {
//         this.users.push({
//             UserName: userName,
//             Arn: 'arn:'+ userName +':bucket1:write:read:exec',
//             CreateDate: '2020-02-18',
//             UserId: '111111-111111-1111-1111-1111-111',
//         });
//         this.users = [...this.users];
//         return new Promise(resolve => {
//             return resolve();
//         });
//     }
//
//     listUsers() {
//         return new Promise(resolve => {
//             return resolve({Users: this.users});
//         });
//     }
//
// }
