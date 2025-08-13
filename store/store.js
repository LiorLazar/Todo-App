const { createStore } = Redux

const initialStore = {}

export function appReducer(state = initialStore, cmd = {}) {
    switch (cmd.type) {

        default:
            return state
    }
}

export const store = createStore(appReducer)
window.gStore = store