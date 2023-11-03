import { ActivityType } from "discord.js";
import statusJSON from "../json/status.json" assert { type: 'json'}

export function setActivity(client, message = null) {
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

        statusText = statusJSON[status][Math.floor(Math.random() * statusJSON[status].length)];
    }
    
    client.user.setActivity(statusText, { type: activityType });
}