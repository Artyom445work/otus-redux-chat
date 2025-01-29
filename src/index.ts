import { Chat } from './chat'
import './style.css'

const container = document.getElementById('app')
if (container) {
    new Chat(container)
}