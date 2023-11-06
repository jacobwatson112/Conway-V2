import usersJSON from "../json/users.json" assert { type: 'json'}

export function isUser(messageUserId) {
    return getUser(usersJSON.users, messageUserId)
}

export function getUser(users, messageUserId) {
    for (let user of users) {
        if (user.id === messageUserId) {
            return user
        }
    }
    return ''
}