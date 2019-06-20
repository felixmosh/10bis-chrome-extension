import { IAppState, IOrder, IUserDetails } from '../../../../types/types';
import { tenBisApi } from '../../services/api';

export const StatsActions = {
  SAVE_ORDERS: 'save_orders',
  UPDATE_MONTH_BY: 'update_month_by'
};

function saveOrders(orders: IOrder[]) {
  return {
    type: StatsActions.SAVE_ORDERS,
    value: orders
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
    tenBisApi.getUserOrders(user.id, bias).then((response) => {
      dispatch(saveOrders(response.orders));
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
