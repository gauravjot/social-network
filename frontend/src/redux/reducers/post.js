import * as actions from '../actions/actionTypes';

// id: payload.id,
// person_id: payload.person_id,
// post_text: payload.post_text,
// post_image: payload.post_image,
// likes: payload.likes,
// created: payload.created,
// updated: payload.updated

const postReducer = (state={posts:undefined}, action) => {
    const { type, payload } = action;
    switch(type){
        case actions.REMOVE_ALL_POSTS:
            return state = {};
        case actions.SET_POSTS:
            return state = {posts: payload};
        case actions.ADD_POST:
            return state = {...state, posts: [payload, ...state.posts]};
        case actions.GET_POST:
            return state;
        case actions.GET_POSTS:
            return state;
        default:
            return state;
    }
}

export default postReducer;