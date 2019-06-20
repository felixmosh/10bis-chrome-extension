import { tenBisApi } from '../../services/api';
import { chromeService } from '../../services/chrome';

export const UserActions = {
  LOGIN: 'user_login',
  LOGIN_IN_PROGRESS: 'user_login_in_progress',
  LOGIN_SUCCESS: 'user_login_success',
  LOGIN_FAIL: 'user_login_fail',
  RESTORE_LOGIN_IN_PROGRESS: 'user_restore_login_in_progress'
};

function loginInProgress(flag: boolean) {
  return {
    type: UserActions.LOGIN_IN_PROGRESS,
    value: flag
  };
}

function restoreLoginInProgress(flag: boolean) {
  return {
    type: UserActions.RESTORE_LOGIN_IN_PROGRESS,
    value: flag
  };
}

function loginSuccess(user) {
  return {
    type: UserActions.LOGIN_SUCCESS,
    value: user
  };
}

export function restoreLogin() {
  return async (dispatch) => {
    dispatch(restoreLoginInProgress(true));

    try {
      const user = await chromeService.getItem('user');
      dispatch(loginSuccess(user));
      dispatch(restoreLoginInProgress(false));
    } catch (e) {
      try {
        const user = await tenBisApi.login();

        await chromeService.setItem('user', user);

        dispatch(loginSuccess(user));
        dispatch(restoreLoginInProgress(false));
      } catch (e) {
        dispatch(restoreLoginInProgress(false));
      }
    }
  };
}
