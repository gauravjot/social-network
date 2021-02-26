export const updateToken = (payload) => {
    return {
        type: 'SET',
        payload: payload
    }
}

export const removeToken = () => {
    return {
        type: 'REMOVE'
    }
}