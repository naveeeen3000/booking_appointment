import firebase from "./firebase.js"
import { logger, getDateTimeFromString, convertUnixTime, getUTCStartEndTimes } from "../api/utils.js";
import Event from './models.js';
import { getFirestore } from "firebase-admin/firestore";

const DB = getFirestore()

const __check_for_existing_event = async (event, dateStr) => {
    const {startTime, endTime} = getUTCStartEndTimes(dateStr);
    const eventDoc = await DB.collection('events').where('date', '>=', startTime)
                        .where('date', '<=', endTime).where('startTime', '==', event.startTime).get()
    if (eventDoc.empty){
        return false
    }
    return true
}

const insertEvent = async (data) => {
    logger.info("DB_MANAGER: insertEvent", data);
    const event = new Event(data);
    event.validate();
    const eventExists = await __check_for_existing_event(event, data.date);
    if (eventExists){
        logger.info("DB_MANAGER: insertEvent | Event already exists");
        throw new Error("Event already exists.");
    }
    const jsonEventData = event.json();
    logger.info("DB_MANAGER: insertEvent| Write data", jsonEventData);
    await DB.collection('events').doc().set(jsonEventData);
}

const getBookedEvents = async (date, timezone) => {
    logger.info("DB_MANAGER: getBookedEvents", [date, timezone]);
    const {startTime, endTime} = getUTCStartEndTimes(date);
    const eventDocs = await DB.collection('events').
        where('date', '>=', startTime).where('date', '<=', endTime).get()
    const events = {};
    eventDocs.forEach(doc => {
        let data = doc.data();
        let startTime = convertUnixTime(data.startTime._seconds, timezone);
        let date = convertUnixTime(data.date._seconds, timezone);
        let endTime = convertUnixTime(data.endTime._seconds, timezone);
        let startTimeStr = convertUnixTime(data.startTime._seconds, timezone, "hh:mm:ss");
        data.date = date
        data.startTime = startTime
        data.endTime = endTime
        events[startTimeStr] = data;
    });
    return events
}

const getEvents = async (startDate, endDate) => {
    logger.info("DB_MANAGER: getEvents", [startDate, endDate])
    const {startTime} = getUTCStartEndTimes(startDate)
    const {endTime} = getUTCStartEndTimes(endDate)
    const eventDocs = await DB.collection('events').where('date', '>=', startTime)
                        .where('date', '<=', endTime).get();
    const events = [];
    eventDocs.forEach(event => {
        let data = event.data();
        let startTime = convertUnixTime(data.startTime._seconds, data.timezone, "hh:mm:ss");
        let date = convertUnixTime(data.date._seconds, data.timezone, "YYYY-MM-DD");
        let endTime = convertUnixTime(data.endTime._seconds, data.timezone, "hh:mm:ss");

        data.date = date
        data.startTime = startTime
        data.endTime = endTime
        events.push(data);
    })
    return events;
}

export {
    insertEvent,
    getBookedEvents,
    getEvents
}