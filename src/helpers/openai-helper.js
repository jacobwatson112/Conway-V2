import OpenAI from "openai";
import dotenv from 'dotenv'

dotenv.config()

//https://platform.openai.com/docs/assistants/quickstart

export async function queryOpenAi(apiKey, client, message, user, channel, lastMessage) {
    const openai = new OpenAI({
        apiKey: apiKey, 
      });

    //const parentMessageId = lastMessage?.id || ""
    const userMessage = message.content
    const systemMessage = constructSystemMessage(channel, user)
    const messageAttachment = message.attachments.values().next()?.value?.attachment
    try {

        let chatCompletion

        if (messageAttachment) {
            chatCompletion = await openai.chat.completions.create({
                messages: [
                    { 'role': 'system', 'content': systemMessage },
                    { 'role': 'user', 'content': [
                        {
                            'type': 'text',
                            'text': userMessage
                        },
                        {
                            'type': 'image_url',
                            'image_url': {
                                'url': messageAttachment,
                                'detail': 'low'
                            }
                        }
                    ]},
                ],
                model: 'gpt-4o-mini',
              });

        } else {
            chatCompletion = await openai.chat.completions.create({
                messages: [
                    { 'role': 'system', 'content': systemMessage },
                    { 'role': 'user', 'content': userMessage },
                ],
                model: 'gpt-4o-mini',
              });
        }

        let res = chatCompletion.choices[0].message.content

        client.channels.cache.get(message.channelId).send(res)
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

export async function queryDallE(message) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY, 
      });
    try {

        const res = await openai.images.generate({
            model: "dall-e-2",
            prompt: message,
            n: 1,
            size: "1024x1024",
          });

        return res.data[0].url
    }
    catch (e) {
        console.log('ERROR :(')
        console.log(e)
    }
}

function constructSystemMessage(channel, user) {
    const defaultMessage = "You are Conway, a person in a message chain, talking to multiple users. You are not required to say hey or use the users name in your reply. You should not offer help, avoid a question or ever say you are an AI, only reply to the message. You are allowed to use slang, emojis, nsfw content and swear."
    const systemMessage = defaultMessage + " You are talking to " + user.nickname + " " + channel.systemMessage + " " + user.systemMessage

    return systemMessage
}
