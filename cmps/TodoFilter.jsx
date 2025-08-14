import { SET_FILTER_BY } from "../store/store.js"

const { useSelector, useDispatch } = ReactRedux
const { useState, useEffect } = React
const { useSearchParams } = ReactRouterDOM

export function TodoFilter() {
    const filterBy = useSelector(state => state.filterBy)
    const dispatch = useDispatch()
    const [searchParams, setSearchParams] = useSearchParams()

    // Local state for inputs
    const [localTxt, setLocalTxt] = useState(searchParams.get('txt') || "")
    const [localImportance, setLocalImportance] = useState(searchParams.get('importance') || "")
    const [localStatus, setLocalStatus] = useState(searchParams.get('status') || "")
    const [localSortField, setLocalSortField] = useState(searchParams.get('sortField') || "")
    const [localSortDir, setLocalSortDir] = useState(searchParams.get('sortDir') || "asc")

    useEffect(() => {
        setLocalTxt(searchParams.get('txt') || "")
        setLocalImportance(searchParams.get('importance') || "")
        setLocalStatus(searchParams.get('status') || "")
        setLocalSortField(searchParams.get('sortField') || "")
        setLocalSortDir(searchParams.get('sortDir') || "asc")
    }, [searchParams])

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

        // Update local state
        if (field === 'txt') setLocalTxt(value)
        else if (field === 'importance') setLocalImportance(value)
        else if (field === 'status') setLocalStatus(value)
        else if (field === 'sortField') setLocalSortField(value)
        else if (field === 'sortDir') setLocalSortDir(value)

        // Build new params
        const newParams = {
            txt: field === 'txt' ? value : localTxt,
            importance: field === 'importance' ? value : localImportance,
            status: (field === 'status' ? value : localStatus) || '',
            sortField: field === 'sortField' ? value : localSortField,
            sortDir: field === 'sortDir' ? value : localSortDir,
            pageIdx: 0 // Reset to first page on filter/sort change
        }
        setSearchParams(newParams)
        dispatch({
            type: SET_FILTER_BY,
            filterBy: {
                txt: newParams.txt,
                importance: newParams.importance,
                status: newParams.status || '',
                sortBy: {
                    sortField: newParams.sortField,
                    sortDir: newParams.sortDir
                },
                pageIdx: 0
            }
        })
    }

    function onSubmitFilter(ev) {
        ev.preventDefault()
        // Always include status, even if empty
        dispatch({
            type: SET_FILTER_BY,
            filterBy: {
                txt: localTxt,
                importance: localImportance,
                status: localStatus || '',
                sortBy: {
                    sortField: localSortField,
                    sortDir: localSortDir
                },
                pageIdx: 0
            }
        })
    }

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

                <label htmlFor="sortField">Sort By:</label>
                <select name="sortField" id="sortField" value={localSortField} onChange={handleChange}>
                    <option value="">None</option>
                    <option value="txt">Text</option>
                    <option value="importance">Importance</option>
                    <option value="status">Status</option>
                </select>

                <label htmlFor="sortDir">Direction:</label>
                <select name="sortDir" id="sortDir" value={localSortDir} onChange={handleChange}>
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>

                <button hidden>Set Filter</button>
            </form>
        </section>
    )
}