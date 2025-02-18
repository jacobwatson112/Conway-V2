import { DateTime } from "luxon";
import { getChannel } from "./channels-helper.js";
import { queryOllama } from "./ollama-helper.js";

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

export async function writeBirthdayMessage(client, user, messageHistory) {
    const channel = getChannel('0')
    console.log('Sending Birthday message')
    
    messageHistory.push({timestamp: DateTime.now().toMillis(), msg: { 'role': 'user', 'content': 'Write me a happy birthday message' }})

    await queryOllama(client, messageHistory, user, channel)
}