import { createUserManager } from 'redux-oidc';

const currentEndpoint = `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}`;

export function makeUserManager({ oidcAuthority: authority, oidcClientId: clientId }) {
    const config =  {
        authority: authority,
        client_id: clientId,
        redirect_uri: `${currentEndpoint}/login/callback`,
        post_logout_redirect_uri: `${currentEndpoint}/logout/callback`,
        response_type: 'code',
        scope: 'openid profile email roles',
        automaticSilentRenew: true,
    };

    return createUserManager(config);
}
