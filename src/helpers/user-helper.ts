import { User } from "../types/user";
import usersJSON from "../json/users.json"

export function isUser(messageUserId: string) {
    return getUser(usersJSON.users, messageUserId)
}

export function getUser(users: User[], messageUserId: string) {
    for (let user of users) {
        if (user.id === messageUserId) {
            return user
        }
    }
    return ''
}