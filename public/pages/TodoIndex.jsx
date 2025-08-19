import { TodoFilter } from "../cmps/TodoFilter.jsx"
import { TodoList } from "../cmps/TodoList.jsx"
import { DataTable } from "../cmps/data-table/DataTable.jsx"
import { todoService } from "../services/todo.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { loadTodos, removeTodo } from "../store/actions/todos.actions.js"
import { SET_FILTER_BY } from "../store/reducers/todo.reducer.js"

const { useState, useEffect } = React
const { useSelector, useDispatch } = ReactRedux
const { Link, useSearchParams } = ReactRouterDOM


export function TodoIndex() {
    // Special hook for accessing search-params:
    const [searchParams, setSearchParams] = useSearchParams()
    const dispatch = useDispatch()

    const todos = useSelector(state => state.todosModule.todos)
    const filterBy = useSelector(state => state.todosModule.filterBy)
    const isLoading = useSelector(state => state.userModule.isLoading)

    // Calculate total pages based on filterBy and PAGE_SIZE
    const [totalPages, setTotalPages] = useState(1)

    useEffect(() => {
        // var filterBy = todoService.getFilterFromSearchParams(searchParams)
        loadTodos(filterBy)
        setSearchParams({
            txt: filterBy.txt || '',
            importance: filterBy.importance || '',
            status: filterBy.status,
            sortField: filterBy.sortBy ? filterBy.sortBy.sortField : '',
            sortDir: filterBy.sortBy ? filterBy.sortBy.sortDir : 'asc',
            pageIdx: filterBy.pageIdx !== undefined ? filterBy.pageIdx : 0
        })
    }, [filterBy])

    useEffect(() => {
        // Get total todos count for current filter (without pagination)
        todoService.query({
            ...filterBy,
            pageIdx: undefined // ignore pagination for count
        }).then(filteredTodos => {
            const PAGE_SIZE = 3
            setTotalPages(Math.max(1, Math.ceil(filteredTodos.length / PAGE_SIZE)))
        })
    }, [filterBy.txt, filterBy.importance, filterBy.status, filterBy.sortBy])

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
                showSuccessMsg(`Todo is ${(savedTodo.isDone) ? 'done' : 'back on your list'}`)
            })
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Cannot toggle todo ' + todoId)
            })
    }

    function onChangePage(diff) {
        if (filterBy.pageIdx === undefined) return
        let nextPageIdx = filterBy.pageIdx + diff
        if (nextPageIdx < 0) nextPageIdx = 0
        if (nextPageIdx > totalPages - 1) nextPageIdx = totalPages - 1
        dispatch({
            type: SET_FILTER_BY,
            filterBy: { ...filterBy, pageIdx: nextPageIdx }
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
            <div style={{ margin: '20px 0', textAlign: 'center' }}>
                <button onClick={() => onChangePage(-1)} disabled={filterBy.pageIdx === 0}>Prev</button>
                <span style={{ margin: '0 10px' }}>Page {filterBy.pageIdx + 1} of {totalPages}</span>
                <button onClick={() => onChangePage(1)} disabled={filterBy.pageIdx >= totalPages - 1}>Next</button>
            </div>
            <hr />
            <h2>Todos Table</h2>
            <div className="data-table-container">
                <DataTable todos={todos} onRemoveTodo={onRemoveTodo} />
            </div>
        </section>
    )
}