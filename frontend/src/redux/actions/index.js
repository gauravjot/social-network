import * as actions from './actionTypes';

export const setUser = (user) => {
    return {
        type: actions.SET_USER,
        payload: user
    }
}

export const logoutUser = () => {
    return {
        type: actions.LOGOUT_USER
    }
}