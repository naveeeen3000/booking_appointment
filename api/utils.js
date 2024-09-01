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

function getNearestHalfHourTime(momentObj){
    const minutes = momentObj.minutes();
    if (minutes === 0 || minutes === 30) {
        return momentObj.clone().seconds(0).milliseconds(0);
    }
    if (minutes < 30) {
        return momentObj.clone().minutes(30).seconds(0).milliseconds(0);
    } else {
        return momentObj.clone().add(1, 'hours').minutes(0).seconds(0).milliseconds(0);
    }
}

function getFreeSlots(bookedSlots, date, timezone){
    logger.info("getFreeSlots", {data: [bookedSlots, date, timezone]})
    const slotsDetails = config.slotDetails;
    let startTime = getLocalDateTimeFromString(`${date}T${slotsDetails.startTime}`, timezone, "YYYY-MM-DDThh:mm:ss")
    let endTime = getLocalDateTimeFromString(`${date}T${slotsDetails.endTime}`, timezone, "YYYY-MM-DDThh:mm:ss")
    const freeSlots = [];
    while(startTime < endTime){
        // console.log("LOOOOOooooooop=======>", startTime)
        if (startTime.format("hh:mm:ss") in bookedSlots){
            const slot = bookedSlots[startTime.format('hh:mm:ss')]
            startTime = getNearestHalfHourTime(slot.endTime)
            // console.log("========>",slot, startTime)
            continue
        }
        freeSlots.push(startTime.format("hh:mm A"))
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
