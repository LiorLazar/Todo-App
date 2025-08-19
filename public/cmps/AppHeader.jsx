const { useSelector, useDispatch } = ReactRedux
const { Link, NavLink } = ReactRouterDOM

import { UserMsg } from "./UserMsg.jsx"
import { LoginSignup } from './LoginSignup.jsx'
import { logout } from '../store/actions/user.actions.js'


export function AppHeader() {
    const loggedinUser = useSelector(state => state.userModule.loggedinUser)
    const todos = useSelector(state => state.todosModule.todos)

    function onLogout() {
        logout()
    }

    function getDonePrecents() {
        var doneCount = todos.filter(todo => todo.isDone).length
        if (!doneCount) return 0
        var precents = doneCount / todos.length
        return precents
    }

    return (
        <header className="app-header full main-layout">
            <section className="header-container">
                <h1>React Todo App</h1>
                <div className="progress-bar-container">
                    <progress className="progress-bar" value={getDonePrecents()}></progress>
                    <span>
                        {Math.round(getDonePrecents() * 100)}% completed
                    </span>
                </div>
                {loggedinUser ? (
                    < section >
                        <Link to={`/user/${loggedinUser._id}`}>Hello {loggedinUser.fullname}</Link> {loggedinUser.balance}
                        <button onClick={onLogout}>Logout</button>
                    </ section >
                ) : (
                    <section>
                        <LoginSignup />
                    </section>
                )}

                <nav className="app-nav">
                    <NavLink to="/" >Home</NavLink>
                    <NavLink to="/about" >About</NavLink>
                    <NavLink to="/todo" >Todos</NavLink>
                    <NavLink to="/dashboard" >Dashboard</NavLink>
                </nav>
            </section>
            <UserMsg />
        </header>
    )
}
