import { userService } from "../../services/user.service.js";
import { SET_USER, store } from "../store";

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