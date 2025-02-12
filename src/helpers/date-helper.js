import { DateTime } from "luxon";

export function cleanMessageHistory(messageHistory) {
    const tenMinutesAgo = DateTime.now().minus({ minutes: 10 });

    return messageHistory.filter(message => 
        DateTime.fromMillis(message.timestamp) >= tenMinutesAgo
    )
}