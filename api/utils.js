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

function addMinutesToDateTime(time, mins){
    return time.add(mins, "minutes");
}

function getDateTimeFromString(timeStr, timezone="Asia/Kolkata", format=null) {
    if (format)
        var localTime = moment.tz(timeStr, format, timezone);
    else
        var localTime = moment.tz(timeStr, timezone=timezone)
    const utcTime = localTime.utc();
    return utcTime;
}

function convertTimeStrToUTCTime(timeStr, timezone, format="hh:mm:ss"){
    const localTime = moment.tz(timeStr, format, timezone)
    const utcTime = localTime.utc();
    return utcTime
}

function convertUnixTime(seconds, timezone, outFormat=null){
    const time = moment.unix(seconds).tz(timezone)
    if (outFormat)
        return time.format(outFormat)
    return time
}

function getLocalDateTimeFromString(timeStr, timezone, format="hh:mm:ss"){
    return moment(timeStr, format).tz(timezone);
}

function getUTCStartEndTimes(dateStr, format="YYYY-MM-DD"){
    const startTime = moment(dateStr, format).startOf('day').utc()
    const endTime = moment(dateStr, format).endOf('day').utc()
    return {startTime, endTime}
}

function getFreeSlots(bookedSlots, date, timezone){
    logger.info("getFreeSlots", {data: [bookedSlots, date, timezone]})
    const slotsDetails = config.slotDetails;
    let startTime = getLocalDateTimeFromString(slotsDetails.startTime, timezone, "hh:mm:ss")
    let endTime = getLocalDateTimeFromString(slotsDetails.endTime, timezone, "hh:mm:ss")
    const freeSlots = [];
    while(startTime < endTime){
        if (!bookedSlots.includes(startTime.format("hh:mm:ss"))){
            freeSlots.push(startTime.format("hh:mm a"))
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
    getFreeSlots,
    addMinutesToDateTime,
    convertTimeStrToUTCTime,
    convertUnixTime,
    getUTCStartEndTimes
}
