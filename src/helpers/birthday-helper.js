import { DateTime } from "luxon";
import { getChannel } from "./channels-helper.js";
import { queryOpenAi } from "./openai-helper.js";

export function getBirthdays(users) {
    let formattedDate = DateTime.now().toFormat('dd/MM')
    for (let user of users) {
        if (user.birthday === formattedDate) {
            return user
        }
    }
    return
}

export function getBirthdayStatus(user) {
    return "Happy Birthday " + user.firstName
}

export async function writeBirthdayMessage(apiKey, client, user) {
    const channel = getChannel('0')
    const message = {
        content: 'Write me a happy birthday message',
        channelId: '686807262773510168'
    }
    console.log('Sending Birthday message')

    await queryOpenAi(apiKey, client, message, user, channel)
}