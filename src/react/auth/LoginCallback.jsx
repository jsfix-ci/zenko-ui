import { CallbackComponent } from 'redux-oidc';
import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';

function LoginCallback(props) {
    return (
        <CallbackComponent
            userManager={props.userManager}
            successCallback={user => {
                console.log('user.state!!!', user.state);
                const path = (user.state && user.state.path) || '/';
                props.dispatch(push(path));
            }}
            errorCallback={error => {
                props.dispatch(push('/'));
                console.error(error);
            }}
        >
            <div>Redirecting...</div>
        </CallbackComponent>
    );
}

function mapStateToProps(state) {
    return {
        userManager: state.auth.userManager,
    };
}

export default connect(mapStateToProps)(LoginCallback);
