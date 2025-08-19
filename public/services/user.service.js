import { storageService } from "./async-storage.service.js"


export const userService = {
    getLoggedinUser,
    login,
    logout,
    signup,
    getById,
    query,
    getEmptyCredentials,
    updateBalance,
    updateActivities,
    updateUser
}

const STORAGE_KEY_LOGGEDIN = 'user'
const STORAGE_KEY = 'userDB'

function query() {
    return storageService.query(STORAGE_KEY)
}

function getById(userId) {
    return storageService.get(STORAGE_KEY, userId)
}

function login({ username, password }) {
    return storageService.query(STORAGE_KEY)
        .then(users => {
            const user = users.find(user => user.username === username)
            if (user) return _setLoggedinUser(user)
            else return Promise.reject('Invalid login')
        })
}

function signup({ username, password, fullname, balance = 100, activities = [], prefs = { color: '#000000', bgColor: '#ffffff' } }) {
    const user = { username, password, fullname, balance, activities, prefs }
    user.createdAt = user.updatedAt = Date.now()

    return storageService.post(STORAGE_KEY, user)
        .then(_setLoggedinUser)
}

function logout() {
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN)
    return Promise.resolve()
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN))
}

function _setLoggedinUser(user) {
    const userToSave = {
        _id: user._id,
        fullname: user.fullname,
        balance: user.balance,
        activities: user.activities || [],
        prefs: user.prefs || { color: '#000000', bgColor: '#ffffff' }
    }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN, JSON.stringify(userToSave))
    return userToSave
}

function getEmptyCredentials() {
    return {
        fullname: '',
        username: 'muki',
        password: 'muki1',
        balance: 100,
        activities: [],
        prefs: { color: '#000000', bgColor: '#ffffff' }
    }
}

function updateBalance(diff) {
    return userService.getById(getLoggedinUser()._id)
        .then(user => {
            if (user.balance + diff < 0) return Promise.reject('Negative Balance')
            user.balance += diff
            return storageService.put(STORAGE_KEY, user)
                .then(user => {
                    _setLoggedinUser(user)
                    return user.balance
                })
        })
}

function updateActivities(activities) {
    return userService.getById(getLoggedinUser()._id)
        .then(user => {
            user.activities = activities
            return storageService.put(STORAGE_KEY, user)
                .then(user => {
                    _setLoggedinUser(user)
                    return user.activities
                })
        })
}

function updateUser(user) {
    return storageService.put(STORAGE_KEY, user)
        .then(user => {
            _setLoggedinUser(user)
            return user
        })
}

// signup({username: 'muki', password: 'muki1', fullname: 'Muki Ja'})
// login({username: 'muki', password: 'muki1'})

// Data Model:
// const user = {
//     _id: "KAtTl",
//     username: "muki",
//     password: "muki1",
//     fullname: "Muki Ja",
//     createdAt: 1711490430252,
//     updatedAt: 1711490430999
// }