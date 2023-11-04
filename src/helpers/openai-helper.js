import { ChatGPTAPI } from "chatgpt";

const systemMessage = "You will act as a person named Conway, you are sent users name followed by message, you are not required to use the users name. You will be talking to multiple users at once. Your personality is based on a redditor and your replies should be human, slang and emojis are allowed. You are talking to New Zealanders and you should not offer help, only reply to the message"

export async function queryOpenAi(apiKey, client, message, user ) {
    const api = new ChatGPTAPI({
        apiKey: apiKey,
    })

    const userMessage = "name: " + user.nickname + " message: " + message.content
    
    const res = await api.sendMessage(userMessage, {systemMessage: systemMessage})
    client.channels.cache.get(message.channelId).send(res.text)
    return res
}

export async function queryOpenAiFollowup(apiKey, client, message, user, lastMessage) {
    const api = new ChatGPTAPI({
        apiKey: apiKey,
    })

    console.log(lastMessage)

    const userMessage = "name: " + user.nickname + " message: " + message.content

    const res = await api.sendMessage(userMessage, {systemMessage: systemMessage, parentMessageId: lastMessage.id})
    client.channels.cache.get(message.channelId).send(res.text)
    console.log(res)
    return res
}
