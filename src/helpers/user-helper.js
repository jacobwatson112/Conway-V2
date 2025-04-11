import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const databasePath = path.join(__dirname, "../json/users.json");

export function isUser(messageUserId) {
    return getUser(messageUserId)
}

export function isAdminUser(messageUserId) {
    const user = getUser(messageUserId)
    return user?.admin
}

export function getUser(messageUserId) {
    let users
    if (fs.existsSync(databasePath)) {
        const data = JSON.parse(fs.readFileSync(databasePath, "utf8"));
        users = data.users
    } else {
        console.log('Error: Failed to get users')
    }

    for (let user of users) {
        if (user.id === messageUserId) {
            return user
        }
    }
    return ''
}