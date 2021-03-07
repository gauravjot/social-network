import * as actions from '../actions/actionTypes';

const friendsReducer = (state=null, action) => {
    const { type, payload } = action;
    switch(type){
        case actions.EMPTY_FRIENDS:
            return state = null
        case actions.SET_FRIENDS:
            state = payload
        default:
            return state
    }
}

export default friendsReducer;