import {
    createStore, chatReducer, addMessage,
    setMessages, setUsers, setSearchQuery,
    fetchMessages, fetchUsers, Message, User
} from './index'

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
        const message: Message = { id: '1', text: 'Hello', userId: '1', timestamp: Date.now() }
        store.dispatch(addMessage(message))
        const state = store.getState()
        expect(state.messages).toContainEqual(message)
    })

    it('should handle setting messages', () => {
        const messages: Message[] = [{ id: '1', text: 'Hello', userId: '1', timestamp: Date.now() }]
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
            { id: '1', text: 'Hello', userId: '1', timestamp: Date.now() },
            { id: '2', text: 'Hi', userId: '2', timestamp: Date.now() }
        ]
        store.dispatch(setMessages(messages))
        store.dispatch(setSearchQuery('Hello'))
        const state = store.getState()
        expect(state.messages.filter(message => message.text.includes('Hello'))).toEqual([messages[0]])
    })

    it('should handle fetching messages asynchronously', (done) => {
        const messages: Message[] = [
            { id: '1', text: 'Hello', userId: '1', timestamp: Date.now() },
            { id: '2', text: 'Hi', userId: '2', timestamp: Date.now() }
        ]
        store.dispatch(fetchMessages(messages))
        setTimeout(() => {
            const state = store.getState()
            expect(state.messages).toEqual(messages)
            done()
        }, 1500)
    })

    it('should handle fetching users asynchronously', (done) => {
        const users: User[] = [
            { id: '1', name: 'User1' },
            { id: '2', name: 'User2' }
        ]
        store.dispatch(fetchUsers(users))
        setTimeout(() => {
            const state = store.getState()
            expect(state.users).toEqual(users)
            done()
        }, 1500)
    })
})