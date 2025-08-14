import { todoService } from "../../services/todo.service.js";
import { ADD_TODO, INCREASE_USER_BALANCE, REMOVE_TODO, SET_TODOS, store, TOGGLE_IS_LOADING, UPDATE_TODO } from "../store.js";
import { updateBalance } from "./user.actions.js";

export function loadTodos(filterBy) {
    return todoService.query(filterBy)
        .then(todos => {
            store.dispatch({ type: SET_TODOS, todos })
            store.dispatch({ type: TOGGLE_IS_LOADING, isLoading: false })

        })
}

export function removeTodo(todoId) {
    return todoService.remove(todoId)
        .then(() => { store.dispatch({ type: REMOVE_TODO, todoId }) })
}

export function saveTodo(todoToSave) {
    const type = todoToSave._id ? UPDATE_TODO : ADD_TODO
    if (type === UPDATE_TODO && todoToSave.isDone) updateBalance(10)
    return todoService.save(todoToSave)
        .then(savedTodo => store.dispatch({ type, todo: savedTodo }))
}

export function getDonePrecents() {
    return todoService.query()
        .then(todos => {
            var doneList = todos.filter(todo => todo.isDone)
            var precents = doneList.length * 100 / todos.length
            return precents
        })
}