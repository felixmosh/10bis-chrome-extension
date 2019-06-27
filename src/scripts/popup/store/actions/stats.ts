import {
  IAppState,
  IUserDateResponse,
  IUserDetails
} from '../../../../types/types';
import { tenBisApi } from '../../services/api';
import { chromeService } from '../../services/chrome';

export const StatsActions = {
  SAVE_USER_DATA: 'save_user_data',
  UPDATE_MONTH_BY: 'update_month_by'
};

function saveUserData(data: IUserDateResponse) {
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

const RAW_DATA = 'rawData';

export function getStats(bias: number, user: IUserDetails) {
  return async (dispatch) => {
    let data: IUserDateResponse = null;
    try {
      const storedData = await chromeService.getItem<IUserDateResponse>(
        RAW_DATA
      );
      data = storedData[bias];
      dispatch(saveUserData(data));
    } catch (e) {
      //
    }

    if (bias < 0 && data) {
      return;
    }

    const response = await tenBisApi.getUserData(user.id, bias);

    if (!data || (data && data.orders.length < response.orders.length)) {
      dispatch(saveUserData(response));
      await chromeService.mergeItem(RAW_DATA, { [bias]: response });
    }
  };
}

export function changeMonthBy(bias: number) {
  return (dispatch, getState: () => IAppState) => {
    dispatch(updateMonthBy(bias));

    const { user, stats } = getState();
    getStats(stats.monthBias, user)(dispatch);
  };
}
