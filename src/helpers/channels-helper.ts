import channelJSON from "../json/channels.json"

export function getChannel(channelId: string) {
    for (let channel of channelJSON.channels) {
        if (channel.id === channelId) {
            return channel
        }
    }
    return undefined
}