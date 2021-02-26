const initialTokenState = null

const tokenReducer = (state=initialTokenState, action) => {
    const { type, payload } = action;
    switch(type){
        case 'REMOVE':
            return state = null
        case 'SET':
            return state = payload
        default:
            return state
    }
}

export default tokenReducer;