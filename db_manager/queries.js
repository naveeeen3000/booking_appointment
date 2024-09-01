import firebase from "./firebase.js"
import { logger, getDateTimeFromString } from "../api/utils.js";
import Event from './models.js';
import { getFirestore } from "firebase-admin/firestore";
import moment from "moment";

const DB = getFirestore()

const __check_for_existing_event = async (event) => {
    const eventDoc = await DB.collection('events').where('date', '==', event.date)
                        .where('startTime', '==', event.startTime).get()
    if (eventDoc.empty){
        return false
    }
    return true
}

const insertEvent = async (data) => {
    logger.info("DB_MANAGER: insertEvent", data);
    const event = new Event(data);
    const eventExists = await __check_for_existing_event(event);
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
    const eventDocs = await DB.collection('events').where('date', '==', date).get()
    const events = [];
    eventDocs.forEach(doc => {
        events.push(getDateTimeFromString(doc.data().startTime,timezone));
    });
    return events
}

const getEvents = async (startDate, endDate) => {
    logger.info("DB_MANAGER: getEvents", [startDate, endDate])
    const startDateTime = getDateTimeFromString(startDate)
    const endDateTime = getDateTimeFromString(endDate)
    const eventDocs = await DB.collection('events').where('date', '>=', startDateTime)
                        .where('date', '<=', endDateTime).get();
    const events = [];
    eventDocs.forEach(event => {
        let data = event.data();
        let startTime = moment.unix(data.startTime._seconds).tz(data.timezone);
        let date = moment.unix(data.date._seconds).tz(data.timezone);
        let endTime = moment.unix(data.endTime._seconds).tz(data.timezone);

        data.date = date.format("YYYY-MM-DD");
        data.startTime = startTime.format("HH:mm:ss");
        data.endTime = endTime.format("HH:mm:ss");
        events.push(data);
    })
    return events;
}

export {
    insertEvent,
    getBookedEvents,
    getEvents
}