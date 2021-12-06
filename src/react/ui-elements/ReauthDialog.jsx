// @flow
import { addOIDCUser, loadClients, networkAuthReset } from '../actions';
import { useDispatch, useSelector } from 'react-redux';
import type { AppState } from '../../types/state';
import { Button } from '@scality/core-ui/dist/next';
import { CustomModal as Modal } from './Modal';
import React from 'react';
import { push } from 'connected-react-router';
import { spacing } from '@scality/core-ui/dist/style/theme';

const DEFAULT_MESSAGE = 'We need to log you in.';

const ReauthDialog = () => {
  const needReauth = useSelector(
    (state: AppState) => state.networkActivity.authFailure,
  );
  const errorMessage = useSelector((state: AppState) =>
    state.uiErrors.errorType === 'byAuth' ? state.uiErrors.errorMsg : null,
  );
  const pathname = useSelector(
    (state: AppState) => state.router.location.pathname,
  );
  const oidcLogout = useSelector((state: AppState) => state.auth.oidcLogout);

  const dispatch = useDispatch();

  const reauth = pathName => {
    dispatch(networkAuthReset());
    dispatch(loadClients()).then(() => dispatch(push(pathName)));
    // ADD_OIDC_USER

    const user = window.userManager.signinSilent();
    console.log('user', user);
    if (user) {
      dispatch(addOIDCUser(user));
      dispatch(networkAuthReset());
      dispatch(loadClients()).then(() => dispatch(push(pathName)));
    } else {
      // Sign out
    }
  };

  if (!needReauth) {
    return null;
  }

  return (
    <Modal
      id="reauth-dialog-modal"
      close={() => reauth(pathname)}
      footer={
        <div>
          {oidcLogout && (
            <Button
              style={{ marginRight: spacing.sp24 }}
              icon={<i className="fas fa-sign-out-alt" />}
              variant="secondary"
              onClick={() => oidcLogout(true)}
              label="Log Out"
            />
          )}
          <Button
            variant="primary"
            onClick={() => reauth(pathname)}
            label="Reload"
          />
        </div>
      }
      isOpen={true}
      title="Authentication Error"
    >
      {errorMessage || DEFAULT_MESSAGE}
    </Modal>
  );
};

export default ReauthDialog;
