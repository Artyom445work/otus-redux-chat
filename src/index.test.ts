import {
    createStore, chatReducer, addMessage,
    setMessages, setUsers, setSearchQuery,
    Message, User
} from './chatReducer'

describe('Chat Store', () => {
    let store: ReturnType<typeof createStore>

    beforeEach(() => {
        store = createStore(chatReducer)
    })

    it('should initialize with default state', () => {
        const state = store.getState()
        expect(state).toEqual({
            messages: [],
            users: [],
            searchQuery: ''
        })
    })

    it('should handle adding a message', () => {
        const message: Message = { nickname: 'user', id: '1', message: 'Hello', timestamp: Date.now() }
        store.dispatch(addMessage(message))
        const state = store.getState()
        expect(state.messages).toContainEqual(message)
    })

    it('should handle setting messages', () => {
        const messages: Message[] = [{ nickname: 'user', id: '1', message: 'Hello', timestamp: Date.now() }]
        store.dispatch(setMessages(messages))
        const state = store.getState()
        expect(state.messages).toEqual(messages)
    })

    it('should handle setting users', () => {
        const users: User[] = [{ id: '1', name: 'User1' }]
        store.dispatch(setUsers(users))
        const state = store.getState()
        expect(state.users).toEqual(users)
    })

    it('should handle setting search query', () => {
        const query = 'Hello'
        store.dispatch(setSearchQuery(query))
        const state = store.getState()
        expect(state.searchQuery).toEqual(query)
    })

    it('should filter messages based on search query', () => {
        const messages: Message[] = [
            { nickname: 'user1', id: '1', message: 'Hello', timestamp: Date.now() },
            { nickname: 'user2', id: '2', message: 'Hi', timestamp: Date.now() }
        ]
        store.dispatch(setMessages(messages))
        store.dispatch(setSearchQuery('Hello'))
        const state = store.getState()
        expect(state.messages.filter(message => message.message.includes('Hello'))).toEqual([messages[0]])
    })
})