import { useContext, createContext, useReducer } from "react";

const notificationReducer = (state, action) => {
    switch (action.type){
        case "SET_NOTIFICATION":
            return action.payload
        case "CLEAR_NOTIFICATION":
            return {text: "", type: ""}
        default:
            return state
    }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
    const [notification, notificationDispatch] = useReducer(notificationReducer, {text: "", type: ""})
    return(
        <NotificationContext.Provider value = {[notification, notificationDispatch]}>
            {props.children}
        </NotificationContext.Provider>
    )
}

export const useNotification = () => {
    const [notification, notificationDispatch] = useContext(NotificationContext)

    const setNotification = (messageObject) => {
        notificationDispatch({type: "SET_NOTIFICATION", payload: messageObject})
        setTimeout(() => {
            notificationDispatch({type: "CLEAR_NOTIFICATION"})
        }, 5000)
    }
    return [notification, setNotification]
}