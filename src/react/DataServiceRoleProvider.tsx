import { createContext, useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { generatePath, useHistory } from 'react-router';
import { regexArn, useAccounts } from './utils/hooks';
import { getRoleArnStored, setRoleArnStored } from './utils/localStorage';

export const _DataServiceRoleContext = createContext<null | {
  role: { roleArn: string };
}>(null);

export const useDataServiceRole = () => {
  const DataServiceCtxt = useContext(_DataServiceRoleContext);

  if (!DataServiceCtxt) {
    throw new Error(
      'The useDataServiceRole hook can only be used within DataServiceRoleProvider.',
    );
  }

  return DataServiceCtxt.role;
};

export const useCurrentAccount = () => {
  const { accountName } = useParams<{ accountName: string }>();
  const storedRoleArn = getRoleArnStored();
  const accountId = storedRoleArn
    ? regexArn.exec(storedRoleArn).groups['account_id']
    : '';
  const accountsWithRoles = useAccounts();
  const history = useHistory();
  const account = useMemo(() => {
    return accountsWithRoles.find((account) => {
      if (accountName) return account.Name === accountName;
      else if (accountId) return account.id === accountId;
      else return true;
    });
  }, [storedRoleArn, JSON.stringify(accountsWithRoles)]);

  const selectAccountAndRoleRedirectTo = (
    path: string,
    accountName: string,
    roleArn: string,
  ) => {
    setRoleArnStored(roleArn);
    history.push(
      generatePath(path, {
        accountName: accountName,
      }),
    );
  };
  return {
    account,
    selectAccountAndRoleRedirectTo,
  };
};

const DataServiceRoleProvider = ({ children }: { children: JSX.Element }) => {
  const storedRoleArn = getRoleArnStored();
  const { account } = useCurrentAccount();
  const roleArn = useMemo(() => {
    if (!storedRoleArn) {
      // by default assume the first Role in the list
      return account?.Roles[0].Arn;
    } else {
      return storedRoleArn;
    }
  }, [storedRoleArn, JSON.stringify(account)]);

  return (
    <_DataServiceRoleContext.Provider
      value={{
        role: { roleArn },
      }}
    >
      {children}
    </_DataServiceRoleContext.Provider>
  );
};

export default DataServiceRoleProvider;
