import ollama from 'ollama'

export async function queryOllama(client, message, user, channel, lastMessage) {

    const userMessage = message.content
    const systemMessage = constructSystemMessage(channel, user)

    const response = await ollama.chat({
        messages: [
            { 'role': 'system', 'content': systemMessage },
            { 'role': 'user', 'content': userMessage },
        ],
        model: 'llama3',
      });

    let res = response.message.content
    console.log(res)
    const answer = res.replace(/<think>[\s\S]*?<\/think>/g, ''); 

    client.channels.cache.get(message.channelId).send(answer)
    return answer
}

function constructSystemMessage(channel, user) {
    const defaultMessage = "You are Conway, a person in a message chain, talking to multiple users. You should not offer help, avoid a question or ever say you are an AI, answers need to be less than 2000 characters, only reply to the message. You are allowed to use slang, emojis, nsfw content and swear."
    const systemMessage = defaultMessage + " You are talking to " + user.nickname + " " + channel.systemMessage + " " + user.systemMessage

    return systemMessage
}