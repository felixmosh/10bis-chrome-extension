import { combineReducers } from 'redux';
import { optionsReducer } from './options-reducer';
import { statsReducer } from './stats-reducer';
import { userReducer } from './user-reducer';

export const appReducer = combineReducers({
  user: userReducer,
  stats: statsReducer,
  options: optionsReducer
});
