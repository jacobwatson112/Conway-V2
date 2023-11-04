
export function getUser(users, messageUserId) {
    for (let user of users) {
        if (user.id === messageUserId) {
            return user
        }
    }
    return ''
}