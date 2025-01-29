import { getFilteredMessages, setSearchQuery } from './chatReducer'
import { fetchMessages, sendNewMessage } from './chatActions'
import store from './store'
import laughing from './img/laughing.png'
import sad from './img/sad.png'
import smiling from './img/smiling.png'

export class Chat {
    private container: HTMLElement

    constructor(container: HTMLElement) {
        this.container = container
        this.render()
        store.subscribe(() => this.render())
        store.dispatch(fetchMessages())
    }

    render() {
        const emojiMap: { [key: string]: string } = {
            ':)':  `<img src="${smiling}" class="smiling img"`,
            ':(': `<img src="${sad}" class="sad img"`,
            ':D': `<img src="${laughing}" class="laughing img"`
        }

        const replaceEmojis = (text: string) => {
            Object.keys(emojiMap).forEach(key => {
                const escapedKey = key.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
                text = text.replace(new RegExp(escapedKey, 'g'), emojiMap[key])
            })
            return text
        }

        const state = store.getState()
        const messages = getFilteredMessages(state)

        this.container.innerHTML = `
            <div class="chat">
                <form id="filterForm">
                    <input type="text" id="filterInput" placeholder="Поиск сообщений..." />
                    <button type="submit">Поиск</button>
                </form>
                <form id="messageForm">
                    <input type="text" id="messageNickname" placeholder="Введите никнейм" />
                    <input type="text" id="messageInput" placeholder="Введите сообщение..." />
                    <button type="submit">Отправить</button>
                </form>
                <div class="messages">
                    ${messages.map(msg => `
                        <div class="message">
                            <strong>${msg.nickname}:</strong> ${replaceEmojis(msg.message)}
                        </div>
                    `).join('')}
                </div>
                
            </div>
        `

        const messageForm = this.container.querySelector('#messageForm') as HTMLFormElement
        messageForm.addEventListener('submit', (e) => {
            e.preventDefault()
            const input = this.container.querySelector('#messageInput') as HTMLInputElement
            const nickname = (this.container.querySelector('#messageNickname') as HTMLInputElement).value

            const message = input.value
            if (message) {
                store.dispatch(sendNewMessage({ nickname: nickname || 'User', message }))
                input.value = ''
            }
        })

        const filterForm = this.container.querySelector('#filterForm') as HTMLFormElement
        filterForm.addEventListener('submit', (e) => {
            e.preventDefault()
            const filterValue = (this.container.querySelector('#filterInput') as HTMLInputElement).value
            store.dispatch(setSearchQuery(filterValue))
        })
    }
}