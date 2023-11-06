import { DateTime } from "luxon";

export function getBirthdays(users) {
    let formattedDate = DateTime.now().toFormat('dd/mm')
    for (let user of users) {
        if (user.birthday === formattedDate) {
            return user
        }
    }
    return
}

export function getBirthdayStatus(user) {
    return "Happy Birthday " + user.firstName
}