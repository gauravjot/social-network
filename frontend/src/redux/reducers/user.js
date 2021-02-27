import * as actions from '../actions/actionTypes';

const userReducer = (state={}, action) => {
    const { type, payload } = action;
    switch(type){
        case actions.LOGOUT_USER:
            return state = {}
        case actions.SET_USER:
            return state = {
                id: payload.id,
                first_name: payload.first_name,
                last_name: payload.last_name,
                avatar: payload.avatar,
                tagline: payload.tagline,
                birthday: payload.birthday,
                token: payload.token
            };
        default:
            return state
    }
}

export default userReducer;