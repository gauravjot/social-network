import userReducer from './user'
import {combineReducers} from 'redux';

const allReducers = combineReducers({user: userReducer});


export default allReducers;