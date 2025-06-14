import { DateTime } from "luxon";
import { getChannel } from "./channels-helper.js";
import { queryOllama } from "./ollama-helper.js";
import { addMessageHistory } from "./history-helper.js";

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

export async function writeBirthdayMessage(client, user) {
    const channel = getChannel('0')
    console.log('Sending Birthday message')
    
    addMessageHistory('user', 'Write me a happy birthday message')
    await queryOllama(client, user, channel)
}