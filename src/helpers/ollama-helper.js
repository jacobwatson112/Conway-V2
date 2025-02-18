import ollama from 'ollama'

export async function queryOllama(client, messageHistory, user, channel) {

    const messages = []
    const systemMessage = constructSystemMessage(channel, user)

    for (let message of messageHistory) {
        messages.push(message.msg)
    }

    const response = await ollama.chat({
        messages: [
            { 'role': 'system', 'content': systemMessage },
            ...messages
        ],
        model: 'llama3',
    });

    let res = response.message.content
    console.log(res)
    const answer = res.replace(/<think>[\s\S]*?<\/think>/g, ''); 

    client.channels.cache.get(channel.discordId).send(answer)
    return answer
}

function constructSystemMessage(channel, user) {
    const defaultMessage = "You are Conway, a person in a message chain, talking to multiple users. You should not offer help, avoid a question or ever say you are an AI, answers need to be less than 2000 characters, only reply to the message. You are allowed to use slang, emojis, nsfw content and swear."
    const systemMessage = defaultMessage + " You are talking to " + user.nickname + " " + channel.systemMessage + " " + user.systemMessage

    return systemMessage
}