import { UserActions } from '../actions/user';
import {IUserDetails} from '../../../../types/types';

const initialState = {
  isLoginInProgress: false,
  isRestoreLoginInProgress: false,
};

export interface IUserState extends IUserDetails {

  isLoginInProgress: boolean;
  isRestoreLoginInProgress: boolean;
}

export function userReducer(state: Partial<IUserState> = initialState, action) {
  switch (action.type) {
    case UserActions.LOGIN_SUCCESS:
      return { ...state, ...action.value,  };
    case UserActions.LOGIN_IN_PROGRESS:
      return { ...state, isLoginInProgress: action.value };
    case UserActions.RESTORE_LOGIN_IN_PROGRESS:
      return { ...state, isRestoreLoginInProgress: action.value };
    default:
      return state;
  }
}
