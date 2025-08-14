import { TodoFilter } from "../cmps/TodoFilter.jsx"
import { TodoList } from "../cmps/TodoList.jsx"
import { DataTable } from "../cmps/data-table/DataTable.jsx"
import { todoService } from "../services/todo.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { loadTodos, removeTodo } from "../store/actions/todos.actions.js"

const { useState, useEffect } = React
const { useSelector, useDispatch } = ReactRedux
const { Link, useSearchParams } = ReactRouterDOM

export function TodoIndex() {
    // Special hook for accessing search-params:
    const [searchParams, setSearchParams] = useSearchParams()

    const todos = useSelector(state => state.todos)
    const filterBy = useSelector(state => state.filterBy)
    const isLoading = useSelector(state => state.isLoading)


    useEffect(() => {
        // var filterBy = todoService.getFilterFromSearchParams(searchParams)
        loadTodos(filterBy)
        setSearchParams(filterBy)
    }, [filterBy])

    function onRemoveTodo(todoId) {
        confirm('Are you sure you want to remove this todo?')
        removeTodo(todoId)
            .then(() => showSuccessMsg('Todo Removed Successfully.'))
            .catch(err => {
                showErrorMsg('Failed To Remove Todo.')
                console.log('Failed To Remove Todo:', err)
            })
    }

    function onToggleTodo(todo) {
        const todoToSave = { ...todo, isDone: !todo.isDone }
        todoService.save(todoToSave)
            .then((savedTodo) => {
                // setTodos(prevTodos => prevTodos.map(currTodo => (currTodo._id !== todo._id) ? currTodo : { ...savedTodo }))
                showSuccessMsg(`Todo is ${(savedTodo.isDone) ? 'done' : 'back on your list'}`)
            })
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Cannot toggle todo ' + todoId)
            })
    }

    if (!todos) return <div>no todos to show..</div>
    if (isLoading) return <div>Loading...</div>

    return (
        <section className="todo-index">
            <TodoFilter />
            <div>
                <Link to="/todo/edit" className="btn" >Add Todo</Link>
            </div>
            <h2>Todos List</h2>
            <TodoList todos={todos} onRemoveTodo={onRemoveTodo} onToggleTodo={onToggleTodo} />
            <hr />
            <h2>Todos Table</h2>
            <div style={{ width: '60%', margin: 'auto' }}>
                <DataTable todos={todos} onRemoveTodo={onRemoveTodo} />
            </div>
        </section>
    )
}