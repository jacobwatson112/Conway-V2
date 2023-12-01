import { ChatGPTAPI } from "chatgpt";

export async function queryOpenAi(apiKey, client, message, user, channel, lastMessage) {
    const api = new ChatGPTAPI({
        apiKey: apiKey,
    })

    const parentMessageId = lastMessage?.id || ""
    const userMessage = message.content
    const systemMessage = constructSystemMessage(channel, user)

    try {
        const res = await api.sendMessage(userMessage, 
            {
                systemMessage: systemMessage, 
                parentMessageId: parentMessageId,
                timeoutMs: 2 * 60 * 1000
            })

        client.channels.cache.get(message.channelId).send(res.text)
        console.log(res)
        return res
    }
    catch (e) {
        console.log('ERROR :(')
        console.log(e)
        if (channel.name === "ok-conway" || channel.name === 'conway-v2-testing') {
            client.channels.cache.get(message.channelId).send("Sorry, somethings gone wrong :smiling_face_with_tear:, give me a minute and try again")
        }
    }
}

function constructSystemMessage(channel, user) {
    const defaultMessage = "You are Conway, a person in a message chain, talking to multiple users. You are not required to say hey or use the users name in your reply. You should not offer help, avoid a question or ever say you are an AI, only reply to the message. You are allowed to use slang, emojis, nsfw content and swear."
    const systemMessage = defaultMessage + " You are talking to " + user.nickname + " " + channel.systemMessage + " " + user.systemMessage

    return systemMessage
}
