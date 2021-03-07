import userReducer from './user';
import postReducer from './post';
import friendsReducer from './friends'
import {combineReducers} from 'redux';

const allReducers = combineReducers({user: userReducer, posts:postReducer, friends:friendsReducer});


export default allReducers;