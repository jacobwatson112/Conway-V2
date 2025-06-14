import moodsJSON from "../json/moods.json" assert { type: 'json'}
import fs from 'fs'
import path from 'path'

const moodsFilePath = path.resolve('./json/moods.json')

let mood = ''

export function getMood() {
    if (!mood) {
        setMood()
    }
    return mood
}

export function setMood() {
  const randomIndex = Math.floor(Math.random() * moodsJSON.moods.length)
  mood = moodsJSON.moods[randomIndex]
}

export function addMood(newMood) {
    if (typeof newMood !== 'string' || newMood.trim() === '') {
        throw new Error('Mood must be a non-empty string')
    }

    const existingMoods = moodsJSON.moods
    if (existingMoods.includes(newMood)) {
        throw new Error('Mood already exists')
    }

    const updatedMoods = [...existingMoods, newMood]

    // Save it back to moods.json
    const newData = JSON.stringify({ moods: updatedMoods }, null, 2)
    fs.writeFileSync(moodsFilePath, newData, 'utf-8')

    // Optionally: update the in-memory version
    moodsJSON.moods = updatedMoods
}