import { showSuccessMsg } from "../services/event-bus.service.js"
import { updateUser } from "../store/actions/user.actions.js"
import { SET_USER } from "../store/store.js"

const { useSelector, useDispatch } = ReactRedux

export function UserDetails() {
    const dispatch = useDispatch()
    const loggedinUser = useSelector(state => state.loggedinUser)

    if (!loggedinUser) return <div>Please log in to view your profile.</div>

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
        let newUser
        if (field === 'color' || field === 'bgColor') {
            newUser = {
                ...loggedinUser,
                prefs: {
                    ...loggedinUser.prefs,
                    [field]: value
                }
            }
        } else {
            newUser = { ...loggedinUser, [field]: value }
        }
        dispatch({ type: SET_USER, loggedinUser: newUser })
    }

    function handleSubmit(ev) {
        ev.preventDefault()
        updateUser()
            .then(showSuccessMsg('Profile Saved Successfully.'))
    }

    function getRelativeTime(timestamp) {
        const now = Date.now()
        const diff = now - timestamp
        if (diff < 60 * 1000) return 'a few seconds ago'
        if (diff < 60 * 60 * 1000) return `${Math.floor(diff / (60 * 1000))} minutes ago`
        if (diff < 24 * 60 * 60 * 1000) return `${Math.floor(diff / (60 * 60 * 1000))} hours ago`
        return 'a long time ago'
    }
    const { fullname, color, bgColor } = loggedinUser.prefs
    const sortedActivities = [...loggedinUser.activities].sort((a, b) => b.at - a.at)
    return (
        <section className="user-details container">
            <h1>Profile</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="fullname">Name:</label>
                <input value={fullname} onChange={handleChange} type="text" placeholder="Your Name" id="fullname" name="fullname" />

                <label htmlFor="color">Color:</label>
                <input value={color} onChange={handleChange} type="color" id="color" name="color" />

                <label htmlFor="bgColor">BG Color:</label>
                <input value={bgColor} onChange={handleChange} type="color" id="bgColor" name="bgColor" />

                <button type="submit">Save</button>
            </form>

            <h2>Activities List:</h2>
            <ul>
                {sortedActivities.map(activity => (
                    <li key={activity.at}>
                        o {getRelativeTime(activity.at)}: {activity.txt}: '{activity.taskName}'
                    </li>
                ))}
            </ul>
        </section>
    )
}