// @flow
import { Redirect, Route, Switch, matchPath, useRouteMatch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { Account } from '../../types/account';
import type { AppState } from '../../types/state';
import { CustomTabs } from '../ui-elements/Tabs';
import Keys from './details/Keys';
import Locations from './details/Locations';
import Properties from './details/Properties';
import React from 'react';
import { Warning } from '../ui-elements/Warning';
import { push } from 'connected-react-router';
import styled from 'styled-components';

const Tabs = styled(CustomTabs)`
    display: flex;
    flex-direction: column;
`;

type Props = {
    account: ?Account,
};

const NotFound = () => <Warning iconClass='fas fa-3x fa-exclamation-triangle' title='Account not found.' />;

function AccountDetails({ account }: Props) {
    const pathname = useSelector((state: AppState) => state.router.location.pathname);
    const dispatch = useDispatch();
    const { path, url } = useRouteMatch();

    if (!account) {
        return <NotFound/>;
    }

    return (
        <Tabs
            items={[
                {
                    onClick: () => dispatch(push(url)),
                    selected: !!matchPath(pathname, { path: `${path}`, exact: true }),
                    title: 'Properties',
                },
                // {
                //     onClick: () => dispatch(push(`${url}/keys`)),
                //     selected: !!matchPath(pathname, { path: `${path}/keys` }),
                //     title: 'Keys',
                // },
                {
                    onClick: () => dispatch(push(`${url}/locations`)),
                    selected: !!matchPath(pathname, { path: `${path}/locations` }),
                    title: 'Locations',
                },
            ]}
        >
            <Switch>
                <Route exact path={path}>
                    <Properties account={account}/>
                </Route>
                <Route path={`${path}/keys`}>
                    <Keys/>
                </Route>
                <Route path={`${path}/locations`}>
                    <Locations/>
                </Route>
                <Redirect to={url}/>
            </Switch>
        </Tabs>
    );
}

export default AccountDetails;
