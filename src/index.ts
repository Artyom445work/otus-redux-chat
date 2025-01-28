// Типы и интерфейсы
export interface Message {
    id: string
    text: string
    userId: string
    timestamp: number
}

export interface User {
    id: string
    name: string
}

export interface ChatState {
    messages: Message[]
    users: User[]
    searchQuery: string
}

export interface RootState {
    chat: ChatState
}

export type Action = {
    type: string
    payload?: any
}

export type Reducer = (state: ChatState, action: Action) => ChatState

export type Listener = () => void

// Редюсер
const initialState: ChatState = {
    messages: [],
    users: [],
    searchQuery: ''
}

export const chatReducer: Reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_MESSAGE':
            return {
                ...state,
                messages: [...state.messages, action.payload]
            }
        case 'SET_MESSAGES':
            return {
                ...state,
                messages: action.payload
            }
        case 'SET_USERS':
            return {
                ...state,
                users: action.payload
            }
        case 'SET_SEARCH_QUERY':
            return {
                ...state,
                searchQuery: action.payload
            }
        default:
            return state
    }
}

// Создание store
export function createStore(reducer: Reducer, preloadedState?: ChatState) {
    let state: ChatState = preloadedState || reducer(initialState, { type: '@@INIT' })
    const listeners: Listener[] = []

    const getState = () => state

    const dispatch = (action: Action | ((dispatch: (action: Action) => void) => void)) => {
        if (typeof action === 'function') {
            // Если action — это функция (асинхронный экшен), вызываем её и передаем dispatch
            action(dispatch)
        } else {
            // Если action — это объект, обрабатываем его как обычный экшен
            state = reducer(state, action)
            listeners.forEach(listener => listener())
        }
    }

    const subscribe = (listener: Listener) => {
        listeners.push(listener)
        return () => {
            const index = listeners.indexOf(listener)
            if (index !== -1) {
                listeners.splice(index, 1)
            }
        }
    }

    const replaceReducer = (newReducer: Reducer) => {
        reducer = newReducer
        dispatch({ type: '@@REPLACE' })
    }

    return {
        getState,
        dispatch,
        subscribe,
        replaceReducer
    }
}

// Экшены
export const addMessage = (message: Message): Action => ({
    type: 'ADD_MESSAGE',
    payload: message
})

export const setMessages = (messages: Message[]): Action => ({
    type: 'SET_MESSAGES',
    payload: messages
})

export const setUsers = (users: User[]): Action => ({
    type: 'SET_USERS',
    payload: users
})

export const setSearchQuery = (query: string): Action => ({
    type: 'SET_SEARCH_QUERY',
    payload: query
})

// Асинхронные экшены
export const fetchMessages = (messages: Message[]) => (dispatch: (action: Action) => void) => {
    setTimeout(() => {
        dispatch(setMessages(messages))
    }, 1000)
}

export const fetchUsers = (users: User[]) => (dispatch: (action: Action) => void) => {
    setTimeout(() => {
        dispatch(setUsers(users))
    }, 1000)
}

// Селекторы
export const getMessages = (state: RootState) => state.chat.messages
export const getMessageById = (state: RootState, id: string) => state.chat.messages.find(message => message.id === id)
export const getUsers = (state: RootState) => state.chat.users
export const getSearchQuery = (state: RootState) => state.chat.searchQuery
export const getFilteredMessages = (state: RootState) => {
    const query = getSearchQuery(state)
    return getMessages(state).filter(message => message.text.includes(query))
}