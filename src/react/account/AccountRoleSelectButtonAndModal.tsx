import { useState } from 'react';
import { useRouteMatch } from 'react-router';
import { Table } from '@scality/core-ui/dist/components/tablev2/Tablev2.component';
import { Button } from '@scality/core-ui/dist/next';
import { Tooltip } from '@scality/core-ui';
import { SpacedBox } from '@scality/core-ui/dist/components/spacedbox/SpacedBox';
import { CustomModal as Modal, ModalBody } from '../ui-elements/Modal';
import { regexArn, SCALITY_INTERNAL_ROLES, useAccounts } from '../utils/hooks';
import {
  useCurrentAccount,
  useDataServiceRole,
} from '../DataServiceRoleProvider';
import { getRoleArnStored, setRoleArnStored } from '../utils/localStorage';
import { Icon } from '../ui-elements/Help';
import { AccountSelectorButton } from '../ui-elements/Table';

function AccountRoleSelectButtonAndModal() {
  const accounts = useAccounts();
  const { path } = useRouteMatch();
  const { account, selectAccountAndRoleRedirectTo } = useCurrentAccount();
  const { roleArn } = useDataServiceRole();
  const [assumedRoleArn, setAssumedRoleArn] = useState(roleArn);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const accountName = account?.Name;
  const [assumedAccount, setAssumedAccount] = useState(accountName);

  const accountsWithRoles = [];
  accounts.forEach((account) => {
    const accountName = account.Name;
    account.Roles.forEach((role) => {
      const parsedArn = regexArn.exec(role.Arn);
      const rolePath = parsedArn?.groups['path'] || '';
      const roleName = parsedArn?.groups['name'] || '';
      accountsWithRoles.push({
        accountName,
        roleName,
        rolePath,
        roleArn: role.Arn,
      });
    });
  });

  const handleClose = () => {
    setIsModalOpen(false);
  };
  const modalFooter = () => {
    return (
      <div>
        <Button variant="outline" onClick={handleClose} label="Cancel" />
        <Button
          icon={<i className="fas fa-arrow-right"></i>}
          variant="primary"
          onClick={() => {
            setRoleArnStored(assumedRoleArn);
            selectAccountAndRoleRedirectTo(
              path,
              assumedAccount,
              assumedRoleArn,
            );
            handleClose();
          }}
          label="Continue"
          disabled={assumedRoleArn === getRoleArnStored()}
        />
      </div>
    );
  };

  function AccountRoleList() {
    const columns = [
      {
        Header: 'Account Name',
        accessor: 'accountName',
        cellStyle: {
          minWidth: '10rem',
          paddingLeft: '1rem',
        },
      },
      {
        Header: 'Role Name',
        accessor: 'roleName',
        cellStyle: {
          minWidth: '22rem',
        },
        Cell({ value: roleName }: { value: string }) {
          if (SCALITY_INTERNAL_ROLES.includes(roleName)) {
            return (
              <>
                <Tooltip
                  overlay={'This is a Scality predefined Role'}
                  overlayStyle={{
                    width: '12rem',
                  }}
                >
                  {roleName}{' '}
                  <Icon className="fas fa-question-circle fa-xs"></Icon>
                </Tooltip>
              </>
            );
          } else {
            return <>{roleName}</>;
          }
        },
      },
      {
        Header: 'Role Path',
        accessor: 'rolePath',
        cellStyle: {
          minWidth: '10rem',
        },
      },
    ];

    return (
      <div style={{ height: '25rem' }}>
        <Table
          columns={columns}
          data={accountsWithRoles}
          defaultSortingKey={'accountName'}
          getRowId={(row) => row.roleArn}
        >
          <Table.SingleSelectableContent
            rowHeight="h32"
            separationLineVariant="backgroundLevel3"
            backgroundVariant="backgroundLevel1"
            onRowSelected={(rowData) => {
              setAssumedRoleArn(rowData.original.roleArn);
              setAssumedAccount(rowData.original.accountName);
            }}
            selectedId={assumedRoleArn}
            children={(Rows) => {
              return <>{Rows}</>;
            }}
          ></Table.SingleSelectableContent>
        </Table>
      </div>
    );
  }

  return (
    <>
      <AccountSelectorButton
        variant="primary"
        onClick={() => setIsModalOpen(true)}
        label={
          <>
            {accountName}
            <SpacedBox ml={2}>
              <i className="fas fa-chevron-down fa-xs" />
            </SpacedBox>
          </>
        }
        icon={<i className="fas fa-wallet" />}
      ></AccountSelectorButton>
      <Modal
        close={handleClose}
        footer={modalFooter()}
        isOpen={isModalOpen}
        title="Select Account and Role to assume"
      >
        <ModalBody>
          <AccountRoleList />
        </ModalBody>
      </Modal>
    </>
  );
}

export default AccountRoleSelectButtonAndModal;
