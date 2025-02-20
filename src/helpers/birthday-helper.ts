import { DateTime } from "luxon";
import { getChannel } from "./channels-helper";
import { queryOllama } from "./ollama-helper";
import { MessageHistory } from "../types/messageHistory";
import { User } from "../types/user";
import { Channel } from "../types/channel";

export function getBirthdays(users: User[]) {
    let formattedDate = DateTime.now().toFormat('dd/MM')
    for (let user of users) {
        if (user.birthday === formattedDate) {
            return user
        }
    }
    return
}

export function getBirthdayStatus(user: User) {
    return "Happy Birthday " + user.firstName
}

export async function writeBirthdayMessage(client: any, user: User, messageHistory: MessageHistory[]) {
    const channel = getChannel('0')
    console.log('Sending Birthday message')
    
    messageHistory.push({timestamp: DateTime.now().toMillis(), msg: { 'role': 'user', 'content': 'Write me a happy birthday message' }})
    await queryOllama(client, messageHistory, user, channel)
}