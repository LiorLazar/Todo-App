import { SET_FILTER_BY } from "../store/store.js"
import { utilService } from "../services/util.service.js"

const { useSelector, useDispatch } = ReactRedux
const { useState, useEffect, useRef } = React

export function TodoFilter() {

    const filterBy = useSelector(state => state.filterBy)
    const dispatch = useDispatch()
    const [localTxt, setLocalTxt] = useState(filterBy.txt || "")
    const [localImportance, setLocalImportance] = useState(filterBy.importance || "")
    const [localStatus, setLocalStatus] = useState(filterBy.status || "")

    useEffect(() => {
        setLocalTxt(filterBy.txt || "")
        setLocalImportance(filterBy.importance || "")
        setLocalStatus(filterBy.status || "")
    }, [filterBy.txt, filterBy.importance, filterBy.status])

    const debouncedDispatch = useRef(utilService.debounce((newFilterBy) => {
        dispatch({ type: SET_FILTER_BY, filterBy: newFilterBy })
    }, 300)).current

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || ''
                break
            case 'checkbox':
                value = target.checked
                break
            default: break
        }
        if (field === 'txt') {
            setLocalTxt(value)
            debouncedDispatch({ ...filterBy, txt: value, importance: localImportance, status: localStatus })
        } else if (field === 'importance') {
            setLocalImportance(value)
            dispatch({ type: SET_FILTER_BY, filterBy: { ...filterBy, importance: value, txt: localTxt, status: localStatus } })
        } else if (field === 'status') {
            setLocalStatus(value)
            dispatch({ type: SET_FILTER_BY, filterBy: { ...filterBy, status: value, txt: localTxt, importance: localImportance } })
        }
    }

    // Optional support for LAZY Filtering with a button
    function onSubmitFilter(ev) {
        ev.preventDefault()
        dispatch({ type: SET_FILTER_BY, filterBy })
    }

    const { txt = "", importance = "", status = "" } = filterBy
    return (
        <section className="todo-filter">
            <h2>Filter Todos</h2>
            <form onSubmit={onSubmitFilter}>
                <input value={localTxt} onChange={handleChange}
                    type="search" placeholder="By Txt" id="txt" name="txt"
                />
                <label htmlFor="importance">Importance: </label>
                <input value={localImportance} onChange={handleChange}
                    type="number" placeholder="By Importance" id="importance" name="importance"
                />

                <label htmlFor="status">Status:</label>
                <select name="status" id="status" value={localStatus || ''} onChange={handleChange}>
                    <option value=''>All</option>
                    <option value="Active">Active</option>
                    <option value="Done">Done</option>
                </select>

                <button hidden>Set Filter</button>
            </form>
        </section >
    )
}