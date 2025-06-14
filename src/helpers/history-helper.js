import { DateTime } from "luxon";

let messageHistory = []

export function getMessageHistory() {
    return messageHistory
}

export function resetMessageHistory() {
    messageHistory = []
}

// role: string = user or assistant
// messageContent: string
export function addMessageHistory(role, messageContent) {
    messageHistory.push({timestamp: DateTime.now().toMillis(), msg: { 'role': role, 'content': messageContent }})
}

export function cleanMessageHistory() {
    const tenMinutesAgo = DateTime.now().minus({ minutes: 10 });

    messageHistory = messageHistory.filter(message => 
        DateTime.fromMillis(message.timestamp) >= tenMinutesAgo
    ).slice(-10)
}