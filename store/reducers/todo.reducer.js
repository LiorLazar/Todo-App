import { todoService } from "../../services/todo.service.js"

export const SET_TODOS = 'SET_TODOS'
export const REMOVE_TODO = 'REMOVE_TODO'
export const ADD_TODO = 'ADD_TODO'
export const UPDATE_TODO = 'UPDATE_TODO'

export const SET_FILTER_BY = 'SET_FILTER_BY'

const initialStore = {
    todos: [],
    filterBy: todoService.getDefaultFilter(),
}

export function todoReducer(state = initialStore, cmd = {}) {
    switch (cmd.type) {
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

        default:
            return state
    }
}