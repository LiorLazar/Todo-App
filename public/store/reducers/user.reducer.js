export const TOGGLE_IS_LOADING = 'TOGGLE_IS_LOADING'

export const SET_USER = 'SET_USER'
export const SET_USER_BALANCE = 'SET_USER_BALANCE'
export const ADD_USER_ACTIVITY = 'ADD_USER_ACTIVITY'

const initialStore = {
    isLoading: true,
    loggedinUser: null
}

export function userReducer(state = initialStore, cmd = {}) {
    switch (cmd.type) {
        case TOGGLE_IS_LOADING:
            return { ...state, isLoading: cmd.isLoading }

        case SET_USER:
            return { ...state, loggedinUser: cmd.loggedinUser }

        case SET_USER_BALANCE:
            return {
                ...state,
                loggedinUser: { ...state.loggedinUser, balance: cmd.balance }
            }

        case ADD_USER_ACTIVITY:
            return {
                ...state,
                loggedinUser: { ...state.loggedinUser, activities: [...state.loggedinUser.activities, cmd.activity] }
            }

        default:
            return state
    }
}