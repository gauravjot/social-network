import tokenReducer from './token';
import {combineReducers} from 'redux';

const allReducers = combineReducers({token: tokenReducer,});


export default allReducers;