import { IOptions } from '../../../../types/types';
import { OptionsActions } from '../actions/options';

export type IOptionsState = IOptions;

const initialState: IOptionsState = {
  refLine: 0
};

export function optionsReducer(
  state: Partial<IOptionsState> = initialState,
  action
) {
  switch (action.type) {
    case OptionsActions.SAVE_OPTIONS:
      return { ...state, ...action.value };
    default:
      return state;
  }
}
