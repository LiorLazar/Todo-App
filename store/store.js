const { createStore } = Redux

export const TOGGLE_IS_LOADING = 'TOGGLE_IS_LOADING'

export const SET_TODOS = 'SET_TODOS'
export const REMOVE_TODO = 'REMOVE_TODO'
export const ADD_TODO = 'ADD_TODO'
export const UPDATE_TODO = 'UPDATE_TODO'

export const SET_FILTER_BY = 'SET_FILTER_BY'

export const SET_USER = 'SET_USER'

const initialStore = {
    todos: [],
    isLoading: true,
    filterBy: {},
    loggedinUser: null
}

export function appReducer(state = initialStore, cmd = {}) {
    switch (cmd.type) {
        case TOGGLE_IS_LOADING:
            return { ...state, isLoading: cmd.isLoading }
        case SET_TODOS:
            return { ...state, todos: cmd.todos }

        case REMOVE_TODO:
            var todos = state.todos.filter(todo => todo._id !== cmd.todoId)
            return { ...state, todos }

        case ADD_TODO:
            var todos = state.todos.filter(todo => todo._id !== cmd.todoId)
            return { ...state, todos: [...state.todos, cmd.todo] }

        case UPDATE_TODO:
            var todos = state.todos.map(todo => todo._id === cmd.todo._id ? cmd.todo : todo)
            return { ...state, todos }

        case SET_FILTER_BY:
            return { ...state, filterBy: cmd.filterBy }

        case SET_USER:
            return { ...state, loggedinUser: cmd.loggedinUser }
        default:
            return state
    }
}

export const store = createStore(appReducer)
window.gStore = store