import * as actions from '../actions/actionTypes';

const userReducer = (state={}, action) => {
    const { type, payload } = action;
    switch(type){
        case actions.LOGOUT_USER:
            return state = {}
        case actions.SET_USER:
            return state = payload;
        default:
            return state
    }
}

export default userReducer;