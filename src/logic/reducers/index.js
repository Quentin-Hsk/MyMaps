import { combineReducers } from 'redux';
import AuthReducer from './auth_reducer';

export default combineReducers({
  Auth: AuthReducer
});
