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

export const setPosts = (posts) => {
    return {
        type: actions.SET_POSTS,
        payload: posts
    }
}

export const addPost = (post) => {
    return {
        type: actions.ADD_POST,
        payload: post
    }
}

export const removeAllPosts = () => {
    return {
        type: actions.REMOVE_ALL_POSTS,
    }
}

export const setFriends = (friends) => {
    return {
        type: actions.SET_FRIENDS,
        payload: friends
    }
}

export const emptyFriends = () => {
    return {
        type: actions.EMPTY_FRIENDS,
    }
}