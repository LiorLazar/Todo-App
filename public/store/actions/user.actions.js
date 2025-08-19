import { userService } from "../../services/user.service.js";
import { SET_USER, SET_USER_BALANCE } from "../reducers/user.reducer.js";
import { store } from "../store.js";

export function login(user) {
    return userService.login(user)
        .then(loggedinUser => store.dispatch({ type: SET_USER, loggedinUser }))
}

export function signup(user) {
    return userService.signup(user)
        .then(loggedinUser => store.dispatch({ type: SET_USER, loggedinUser }))
}

export function logout() {
    return userService.logout()
        .then(() => store.dispatch({ type: SET_USER, loggedinUser: null }))
}

export function updateBalance(balance) {
    return userService.updateBalance(balance)
        .then(updatedBalance => store.dispatch({ type: SET_USER_BALANCE, balance: updatedBalance }))
}

export function updateActivities() {
    const activities = store.getState().loggedinUser.activities
    return userService.updateActivities(activities)
}

export function updateUser() {
    const user = store.getState().loggedinUser
    return userService.updateUser(user)
        .then(updatedUser => store.dispatch({ type: SET_USER, loggedinUser: updatedUser }))
}