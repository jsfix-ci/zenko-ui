// NOTE: Babel generates properties with only get defined for re-exported functions.
// react-router-dom re-exports all of react-router's exports so
// an error is thrown when jest.spyOn is used to spy on the re-exported functions.
// Instead of importing react-router-dom (which re-exports useParams, useRouteMatch...),
// we import react-router where useParams, useRouteMatch are defined and use that module to create the spy.
import router, { MemoryRouter } from 'react-router';
import AccountContent from '../AccountContent';
import AccountList from '../AccountList';
import Accounts from '../Accounts';
import { EmptyStateSection } from '../../ui-elements/ListLayout';
import React from 'react';
import { reduxMount } from '../../utils/test';

const account1 = {
    arn: 'arn1',
    canonicalId: 'canonicalId1',
    createDate: Date.parse('04 Jan 2000 05:12:00 GMT'),
    email: 'test@email1.com',
    id: '1',
    quotaMax: 1,
    userName: 'bart',
};

const account2 = {
    arn: 'arn2',
    canonicalId: 'canonicalId2',
    createDate: Date.parse('04 Jan 2001 05:12:00 GMT'),
    email: 'test@email2.com',
    id: '2',
    quotaMax: 10,
    userName: 'lisa',
};

describe('Accounts', () => {
    it('should render empty state component if empty list', () => {
        jest.spyOn(router, 'useParams').mockReturnValue({});
        const { component } = reduxMount(<Accounts/>);

        expect(component.find(AccountContent)).toHaveLength(0);
        expect(component.find(AccountList)).toHaveLength(0);

        expect(component.find(EmptyStateSection)).toHaveLength(1);
    });

    it('should render null if loading/redirecting to the first account', () => {
        jest.spyOn(router, 'useParams').mockReturnValue({});

        const { component } = reduxMount(<Accounts/>, {
            configuration: {
                latest: {
                    users: [ account1 ],
                },
            },
        });

        expect(component.find(AccountContent)).toHaveLength(0);
        expect(component.find(AccountList)).toHaveLength(0);

        expect(component.find(EmptyStateSection)).toHaveLength(0);
    });

    it('should render AccountList with account sorted by creation date', () => {
        jest.spyOn(router, 'useRouteMatch').mockReturnValue({ url: '/' });
        jest.spyOn(router, 'useParams').mockReturnValue({ accountName: 'bart' });

        const { component } = reduxMount(<MemoryRouter><Accounts/></MemoryRouter>, {
            configuration: {
                latest: {
                    users: [ account1, account2 ],
                },
            },
            router: {
                location: {
                    pathname: '/accounts/bart',
                },
            },
        });

        const accountContent = component.find(AccountContent);
        expect(accountContent).toHaveLength(1);
        expect(accountContent.prop('account')).toEqual(account1);

        const accountList = component.find(AccountList);
        expect(accountList).toHaveLength(1);
        expect(accountList.prop('accountList').length).toEqual(2);
        expect(accountList.prop('accountList')[0]).toEqual(account2);
        expect(accountList.prop('accountList')[1]).toEqual(account1);

        expect(component.find(EmptyStateSection)).toHaveLength(0);
    });

});
