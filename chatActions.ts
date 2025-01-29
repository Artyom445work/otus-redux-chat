import { setMessages } from './chatReducer'
import { getMessagesList, sendMessage } from './api'

export const fetchMessages = () => async (dispatch: any) => {
    const messages = await getMessagesList()
    dispatch(setMessages(messages))
}

export const sendNewMessage = (data: { nickname: string, message: string }) => async (dispatch: any) => {
    await sendMessage(data)
    dispatch(fetchMessages())
}