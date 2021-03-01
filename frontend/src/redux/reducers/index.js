import userReducer from './user';
import postReducer from './post';
import {combineReducers} from 'redux';

const allReducers = combineReducers({user: userReducer, posts:postReducer});


export default allReducers;