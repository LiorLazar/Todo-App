import { todoService } from "../../services/todo.service.js"
import { userService } from "../../services/user.service.js"
import { ADD_TODO, ADD_USER_ACTIVITY, REMOVE_TODO, SET_TODOS, store, TOGGLE_IS_LOADING, UPDATE_TODO } from "../store.js"
import { updateActivities, updateBalance } from "./user.actions.js"

export function loadTodos(filterBy) {
    return todoService.query(filterBy)
        .then(todos => {
            store.dispatch({ type: SET_TODOS, todos })
            store.dispatch({ type: TOGGLE_IS_LOADING, isLoading: false })
        })
}

export function removeTodo(todoId) {
    return todoService.get(todoId)
        .then(todo => {
            return todoService.remove(todoId)
                .then(() => {
                    store.dispatch({ type: REMOVE_TODO, todoId })
                    store.dispatch({ type: ADD_USER_ACTIVITY, activity: { txt: 'Removed the Todo', at: Date.now(), taskName: todo.txt } })
                    updateActivities()
                })
        })
}

export function saveTodo(todoToSave) {
    const type = todoToSave._id ? UPDATE_TODO : ADD_TODO
    return todoService.save(todoToSave)
        .then(savedTodo => {
            store.dispatch({ type, todo: savedTodo })
            let activityPromise = Promise.resolve()
            if (type === UPDATE_TODO && savedTodo.isDone) {
                updateBalance(10)
                activityPromise = todoService.get(savedTodo._id)
                    .then(todo => {
                        store.dispatch({ type: ADD_USER_ACTIVITY, activity: { txt: 'Marked Todo as Done', at: Date.now(), taskName: todo.txt } })
                        updateActivities()
                    })
            } else if (type === UPDATE_TODO) {
                activityPromise = todoService.get(savedTodo._id)
                    .then(todo => store.dispatch({ type: ADD_USER_ACTIVITY, activity: { txt: 'Updated a Todo', at: Date.now(), taskName: todo.txt } }))
            } else if (type === ADD_TODO) {
                activityPromise = todoService.get(savedTodo._id)
                    .then(todo => {
                        store.dispatch({ type: ADD_USER_ACTIVITY, activity: { txt: 'Added a Todo', at: Date.now(), taskName: todo.txt } })
                        updateActivities()
                    })
            }
            return activityPromise.then(() => ({ todo: savedTodo }))
        })
}

export function getDonePrecents() {
    return todoService.query()
        .then(todos => {
            var doneList = todos.filter(todo => todo.isDone)
            var precents = doneList.length * 100 / todos.length
            return precents
        })
}