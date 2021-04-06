// @flow
import { NavbarContainer, RouteContainer } from './ui-elements/Container';
import React, { useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AccountCreate from './account/AccountCreate';
import Accounts from './account/Accounts';
import type { AppState } from '../types/state';
import DataBrowser from './databrowser/DataBrowser';
import Loader from './ui-elements/Loader';
import LocationEditor from './backend/location/LocationEditor';
import { Navbar } from './Navbar';
import NoMatch from './NoMatch';
import Workflows from './workflow/Workflows';
import { loadClients } from './actions';

function PrivateRoutes() {
    const dispatch = useDispatch();

    const isClientsLoaded = useSelector((state: AppState) => state.auth.isClientsLoaded);
    const authenticated = useSelector((state: AppState) => !!state.oidc.user && !state.oidc.user.expired);

    useEffect(() => {
        if (authenticated) {
            // TODO: forbid loading clients when authorization server redirects the user back to ui.zenko.local with an authorization code.
            // That will fix management API request being canceled during autentication.
            dispatch(loadClients());
        }
    },[dispatch, authenticated]);

    if (!isClientsLoaded) {
        return <Loader> Loading clients </Loader>;
    }
    return (
        <Switch>
            <Route exact path="/" render={() => <Redirect to="/accounts" />}/>

            <Route exact path="/create-location" component={LocationEditor} />
            <Route path="/locations/:locationName/edit" component={LocationEditor} />

            <Route path='/accounts/:accountName?' component={Accounts} />
            <Route path="/create-account" component={AccountCreate} />

            <Route path={['/buckets/:bucketName?', '/buckets/:bucketName/objects', '/create-bucket']} component={DataBrowser} />

            <Route path={['/create-workflow', '/workflows/:ruleId?']} component={Workflows} />

            <Route path="*" component={NoMatch}/>
        </Switch>
    );
}

function Routes() {
    return (
        <RouteContainer>
            <NavbarContainer>
                <Navbar/>
            </NavbarContainer>
            <PrivateRoutes/>
        </RouteContainer>
    );
}

export default Routes;
