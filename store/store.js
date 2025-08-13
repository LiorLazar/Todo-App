const { createStore } = Redux

export const SET_TODOS = 'SET_TODOS'
export const REMOVE_TODO = 'REMOVE_TODO'
export const ADD_TODO = 'ADD_TODO'
export const UPDATE_TODO = 'UPDATE_TODO'

const initialStore = {
    todos: []
}

export function appReducer(state = initialStore, cmd = {}) {
    switch (cmd.type) {
        case SET_TODOS:
            return { ...state, todos: cmd.todos }

        case REMOVE_TODO:
            var todos = state.todos.filter(todo => todo._id !== cmd.todoId)
            return { ...state, todos }
        default:
            return state
    }
}

export const store = createStore(appReducer)
window.gStore = store