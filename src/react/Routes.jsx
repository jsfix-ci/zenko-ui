// @flow
import React, { useEffect, useState } from 'react';
import { Link, Redirect, Route, Switch, matchPath } from 'react-router-dom';
import { NavbarContainer, RouteContainer } from './ui-elements/Container';
import { useDispatch, useSelector } from 'react-redux';
import AccountCreate from './account/AccountCreate';
import Accounts from './account/Accounts';
import type { Action } from '../types/actions';
import type { AppState } from '../types/state';
import DataBrowser from './databrowser/DataBrowser';
import type { DispatchAPI } from 'redux';
import Loader from './ui-elements/Loader';
import LocationEditor from './backend/location/LocationEditor';
import LoginCallback from './auth/LoginCallback';
import { Navbar } from './Navbar';
import NoMatch from './NoMatch';
import PrivateRoute from './ui-elements/PrivateRoute';
import { signout, loadClients } from './actions';

function PrivateRoutes() {
    const dispatch = useDispatch();

    const isClientsLoaded = useSelector((state: AppState) => state.auth.isClientsLoaded);
    const authenticated = useSelector((state: AppState) => !!state.oidc.user && !state.oidc.user.expired);

    useEffect(() => {
        if (authenticated) {
            dispatch(loadClients());
        }
    },[dispatch, authenticated]);

    console.log('isClientsLoaded!!!', isClientsLoaded);
    if (!isClientsLoaded) {
        return <Loader> Login clients </Loader>;
    }
    return (
        <Switch>
            <Route exact path="/" render={() => <Redirect to="/accounts" />}/>

            <Route exact path="/create-location" component={LocationEditor} />
            <Route path="/locations/:locationName/edit" component={LocationEditor} />

            <Route path='/accounts/:accountName?' component={Accounts} />
            <Route path="/create-account" component={AccountCreate} />

            <Route path={['/buckets/:bucketName?', '/buckets/:bucketName/objects', '/create-bucket']} component={DataBrowser} />
            <Route path="*" component={NoMatch}/>
        </Switch>
    );
}

function Routes() {
    // const pathname = useSelector((state: AppState) => state.router.location.pathname);
    // const userName = useSelector((state: AppState) => state.oidc.user.profile.name || '');

    const dispatch: DispatchAPI<Action> = useDispatch();
    return (
        <RouteContainer>
            <NavbarContainer>
                <Navbar/>
            </NavbarContainer>
            <Switch>
                <Route exact path="/login/callback" component={LoginCallback}/>
                <Route path="*" component={PrivateRoutes}/>
            </Switch>
        </RouteContainer>
    );
}

export default Routes;
