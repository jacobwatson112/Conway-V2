import { DateTime } from "luxon";
import { MessageHistory } from "../types/messageHistory";

export function cleanMessageHistory(messageHistory: MessageHistory[]) {
    const tenMinutesAgo = DateTime.now().minus({ minutes: 10 });

    return messageHistory.filter(message => 
        DateTime.fromMillis(message.timestamp) >= tenMinutesAgo
    )
}