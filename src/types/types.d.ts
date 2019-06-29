import { Dispatch } from 'redux';
import { IOptionsState } from '../scripts/popup/store/reducers/options-reducer';
import { IStatsState } from '../scripts/popup/store/reducers/stats-reducer';
import { IUserState } from '../scripts/popup/store/reducers/user-reducer';

export interface IReduxProps {
  dispatch?: Dispatch<any>;
}

export interface IAction {
  type: string;
  value: any;
}

export interface IAppState {
  user: IUserState;
  stats: IStatsState;
  options: IOptionsState;
}

export interface IUserDetails {
  id: string;
  firstname: string;
  lastname: string;
  companyId: number;
}

export interface IOrderDay {
  date: Date;
  orders: IOrder[];
  total: number;
}

export interface IOrder {
  date: Date;
  price: number;
  restaurantName: string;
}

export interface IRawOrder {
  date: string;
  price: number;
  restaurantName: string;
}

export interface IUserDateResponse {
  orders: IRawOrder[];
  monthlyLimit: number;
}

export interface IOptions {
  refLine: number;
}
