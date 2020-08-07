// @flow
import React, { useCallback, useEffect } from 'react';
import Table, * as T from '../ui-elements/Table';
import { useDispatch, useSelector } from 'react-redux';
import { useFilters, useSortBy, useTable } from 'react-table';
import type { Account } from '../../types/account';
import type { AppState } from '../../types/state';
import { FixedSizeList } from 'react-window';
import { Warning } from '../ui-elements/Warning';
import { formatDate } from '../utils';
import { push } from 'connected-react-router';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';

export const Icon = styled.i`
    margin-left: 5px;
`;

const columns = [
    {
        Header: 'Name',
        accessor: 'userName',
    },
    {
        Header: 'Created on',
        accessor: 'createDate',
        Cell: ({ value }) => { return formatDate(new Date(value));},
    },
];

const initialSortBy = [
    {
        id: 'createDate',
        desc: true,
    },
];

function AccountList() {
    const dispatch = useDispatch();
    const { accountName: accountNameParam } = useParams();
    // NOTE: accountList do not need to be memoized.
    // "accountList"'s reference changes when a new configuration is set.
    const accountList = useSelector((state: AppState) => state.configuration.latest.users);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        setFilter,
        prepareRow,
        totalColumnsWidth,
    } = useTable({
        columns,
        data: accountList,
        initialState: { sortBy: initialSortBy },
        autoResetFilters: false,
        autoResetSortBy: false,
    }, useFilters, useSortBy);

    useEffect(() => {
        // NOTE: display the first/newest account after the mount or when an account gets deleted (not on every render).
        if (!accountNameParam && rows.length > 0) {
            dispatch(push(`/accounts/${rows[0].original.userName}`));
        }
    }, [accountNameParam, rows.length]);

    const handleRowClick = (account: Account) => {
        if (account.userName !== accountNameParam) {
            dispatch(push(`/accounts/${account.userName}`));
        }
    };

    const rowSelected = (accountName: string): boolean => {
        return accountName === accountNameParam;
    };

    const RenderRow = useCallback(({ index, style }) => {
        const row = rows[index];
        prepareRow(row);
        return (
            <T.Row isSelected={rowSelected(row.values.userName)} onClick={() => handleRowClick(row.original)} key={row.id} {...row.getRowProps({ style })}>
                {row.cells.map(cell => {
                    return (
                        <T.Cell key={cell.id} {...cell.getCellProps()} >
                            {cell.render('Cell')}
                        </T.Cell>
                    );
                })}
            </T.Row>
        );
    },[prepareRow, rows]);


    // NOTE: empty state component
    if (accountList.length === 0) {
        return <Warning iconClass="fas fa-5x fa-wallet" title='Let&apos;s start, create your first account.' btnTitle='Create Account' btnAction={() => dispatch(push('/createAccount'))} />;
    }

    return (
        <div id='account-list'>
            <T.Search>
                <T.SearchInput placeholder='Filter by Name' onChange={e => setFilter('userName', e.target.value)}/>
                <T.ExtraButton text="Create Account" variant='info' onClick={() => dispatch(push('/createAccount'))} size="default" type="submit" />
            </T.Search>
            <T.Container>
                <Table {...getTableProps()}>
                    <T.Head>
                        {headerGroups.map(headerGroup => (
                            <T.HeadRow key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                    <T.HeadCell key={column.id} {...column.getHeaderProps(column.getSortByToggleProps())} >
                                        {column.render('Header')}
                                        <Icon>
                                            {column.isSorted
                                                ? column.isSortedDesc
                                                    ? <i className='fas fa-sort-down' />
                                                    : <i className='fas fa-sort-up' />
                                                : <i className='fas fa-sort' />}
                                        </Icon>
                                    </T.HeadCell>
                                ))}
                            </T.HeadRow>
                        ))}
                    </T.Head>
                    <T.Body {...getTableBodyProps()}>
                        <FixedSizeList
                            height={500}
                            itemCount={rows.length}
                            itemSize={35}
                            width={totalColumnsWidth}
                        >
                            {RenderRow}
                        </FixedSizeList>
                    </T.Body>
                </Table>
            </T.Container>
        </div>
    );
}

export default AccountList;
