import { createStore, applyMiddleware } from 'redux'
import { thunk } from 'redux-thunk'
import { chatReducer, ChatState } from './chatReducer'

const initialState: ChatState = {
    messages: [],
    users: [],
    searchQuery: ''
}

const store = createStore(chatReducer, initialState, applyMiddleware(thunk))

export default store