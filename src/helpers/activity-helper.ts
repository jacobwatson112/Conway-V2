import { ActivityType } from "discord.js";
import statusJSON from "../json/status.json"

export function setActivity(client: any, message?: string) {
    let activityType = ActivityType.Playing
    let statusText = message

    if (!statusText) {
        const randomNumber = Math.floor(Math.random() * 3)
        let status = 'playing'
        if (randomNumber === 0) {
            status = 'watching'
            activityType = ActivityType.Watching
        } else if (randomNumber === 1) {
            status = 'listening'
            activityType = ActivityType.Listening
        }

        statusText = statusJSON[status as keyof typeof statusJSON][Math.floor(Math.random() * statusJSON[status as keyof typeof statusJSON].length)];
    }
    
    client.user.setActivity(statusText, { type: activityType });
}