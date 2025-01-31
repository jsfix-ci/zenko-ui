// TODO: AccountSeeds should be returned by Vault API
export function getAccountSeeds() {
  return fetch('/account-seeds.json', {
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  }).then((res) => {
    if (!res.ok) {
      throw Error('Can not fetch Account Seeds!!');
    }
    return res.json();
  });
}
