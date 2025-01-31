import STS from 'aws-sdk/clients/sts';
export default class STSClient {
  constructor(conf) {
    this.client = new STS({
      endpoint: conf.endpoint,
      region: 'us-east-1',
    });
  }

  assumeRoleWithWebIdentity(params) {
    const { idToken, roleArn, RoleSessionName } = params;
    const p = {
      DurationSeconds: 900,
      // 15 minutes
      RoleArn: roleArn,
      RoleSessionName,
      WebIdentityToken: idToken,
    };
    return this.client.assumeRoleWithWebIdentity(p).promise();
  }
} // TODO: Testing only, remove it once STS.assumeRoleWithWebIdentity is implemented in Vault.
// export default class STSClient {
//     constructor(conf) {
//         this.client = new AWS.STS({
//             endpoint: conf.endpoint,
//         });
//     }
//
//     assumeRoleWithWebIdentity() {
//         return Promise.resolve({
//             Credentials: {
//                 AccessKeyId: 'accessKey1',
//                 SecretAccessKey: 'verySecretKey1',
//                 // SessionToken: 'AQoDYXdzEE0a8ANXXXXXXXXNO1ewxE5TijQyp+IEXAMPLE',
//             },
//         });
//     }
//
// }