import channelJSON from "../json/channels.json" assert { type: 'json'}

export function getChannel(channelId) {
    for (let channel of channelJSON.channels) {
        if (channel.id === channelId) {
            return channel
        }
    }
    return undefined
}