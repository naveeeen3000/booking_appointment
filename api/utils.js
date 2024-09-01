import { createLogger, transports } from "winston";
import moment from "moment-timezone";
import config from "../config.js"

const logger = createLogger({
    level: "info",
    transports: [new transports.Console(),]
})

function errorResponse(message, data={}){
    return {
        httpStatus: 200,
        data: {
            message,
            data,
            status: "error"
        }
    }
}

function successResponse(message, data={}){
    return {
        httpStatus: 200,
        data: {
            message,
            data,
            status: "success"
        }
    }
}

function getDateTimeFromString(timeStr, format='HH:mm:ss', timezone="Asia/Kolkata") {
    const localTime = moment.tz(timeStr, timezone);
    const utcTime = localTime.utc();
    return utcTime;
}

function getFreeSlots(bookedSlots, date){
    const slotsDetails = config.slotDetails;
    let startTime = getDateTimeFromString(`${date}T${slotsDetails.startTime}`)
    let endTime = getDateTimeFromString(`${date}T${slotsDetails.endTime}`)
    const freeSlots = [];
    while(startTime <= endTime){
        if (!bookedSlots.includes(startTime)){
            freeSlots.push(startTime.format())
        }
        startTime.add(slotsDetails.duration, "minutes")
    }
    return freeSlots;
}

export {
    logger,
    errorResponse,
    successResponse,
    getDateTimeFromString,
    getFreeSlots
}
