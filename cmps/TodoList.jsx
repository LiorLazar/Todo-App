import { TodoPreview } from "./TodoPreview.jsx"
const { Link } = ReactRouterDOM

const { useSelector, useDispatch } = ReactRedux

export function TodoList({ onRemoveTodo, onToggleTodo }) {
    const todos = useSelector(state => state.todos)

    return (
        <ul className="todo-list">
            {!todos.length && <div>No Todos to show...</div>}
            {todos.map(todo =>
                <li key={todo._id}>
                    <TodoPreview todo={todo} onToggleTodo={() => onToggleTodo(todo)} />
                    <section>
                        <button onClick={() => onRemoveTodo(todo._id)}>Remove</button>
                        <button><Link to={`/todo/${todo._id}`}>Details</Link></button>
                        <button><Link to={`/todo/edit/${todo._id}`}>Edit</Link></button>
                    </section>
                </li>
            )}
        </ul>
    )
}