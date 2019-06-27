import { IAppState, IOrder, IUserDetails } from '../../../../types/types';
import { tenBisApi } from '../../services/api';

export const StatsActions = {
  SAVE_USER_DATA: 'save_user_data',
  UPDATE_MONTH_BY: 'update_month_by'
};

function saveUserData(data: { orders: IOrder[]; monthlyLimit: number }) {
  return {
    type: StatsActions.SAVE_USER_DATA,
    value: data
  };
}

function updateMonthBy(monthBias: number) {
  return {
    type: StatsActions.UPDATE_MONTH_BY,
    value: monthBias
  };
}

export function getStats(bias: number, user: IUserDetails) {
  return (dispatch) => {
    tenBisApi.getUserData(user.id, bias).then((response) => {
      dispatch(saveUserData(response));
    });
  };
}

export function changeMonthBy(bias: number) {
  return (dispatch, getState: () => IAppState) => {
    dispatch(updateMonthBy(bias));

    const { user, stats } = getState();
    getStats(stats.monthBias, user)(dispatch);
  };
}
