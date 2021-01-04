import {
  IAppState,
  IUserDateResponse,
  IUserDetails,
} from '../../../../types/types';
import { tenBisApi } from '../../services/api';
import { chromeService } from '../../services/chrome';

export const StatsActions = {
  SAVE_USER_DATA: 'save_user_data',
  UPDATE_MONTH_BY: 'update_month_by',
};

function saveUserData(data: IUserDateResponse) {
  return {
    type: StatsActions.SAVE_USER_DATA,
    value: data,
  };
}

function updateMonthBy(monthBias: number) {
  return {
    type: StatsActions.UPDATE_MONTH_BY,
    value: monthBias,
  };
}

const RAW_DATA = 'rawData';

function getCacheKey(bias: number) {
  const today = new Date();
  today.setMonth(today.getMonth() + bias);
  return `${today.getMonth() + 1}-${today.getFullYear()}`;
}

function getLastDayOfMonth(bias: number) {
  const today = new Date();
  const date =
    bias < 0
      ? new Date(today.getFullYear(), today.getMonth() + bias + 1, 0, 12)
      : today;
  return date.toISOString().split('T').shift();
}

export function getStats(bias: number, user: IUserDetails) {
  return async (dispatch) => {
    const cacheKey = getCacheKey(bias);
    const lastFetchDate = getLastDayOfMonth(bias);

    let data: IUserDateResponse & { lastFetch: string } = null;
    try {
      const storedData = await chromeService.getItem<
        Record<string, IUserDateResponse & { lastFetch: string }>
      >(RAW_DATA);
      data = storedData[cacheKey];
      if (data && data.lastFetch === lastFetchDate) {
        dispatch(saveUserData(data));
        return;
      }
    } catch (e) {
      //
    }

    const response = await tenBisApi.getUserData(user.id, bias);

    dispatch(saveUserData(response));

    if (!data || data.lastFetch !== lastFetchDate) {
      await chromeService.mergeItem(RAW_DATA, {
        [cacheKey]: { ...response, lastFetch: lastFetchDate },
      });
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
