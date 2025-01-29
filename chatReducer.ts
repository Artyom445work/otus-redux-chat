// Типы и интерфейсы
export interface Message {
    nickname: string
    message: string
    id: string
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

export const setMessages = (messages: unknown[]): Action => ({
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

// Селекторы
export const getMessages = (state: ChatState) => state.messages
export const getSearchQuery = (state: ChatState) => {
    return state.searchQuery
}
export const getFilteredMessages = (state: ChatState) => {
    const query = getSearchQuery(state)
    return getMessages(state).filter(message => message.message?.includes(query))
}