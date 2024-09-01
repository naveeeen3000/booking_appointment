import { getDateTimeFromString, addMinutesToDateTime } from "../api/utils.js"
import config from "../config.js";

class Event {
    constructor({date, doctor, startTime, timezone}){
        this.date = getDateTimeFromString(`${date}`, timezone, "YYYY-MM-DD")
        this.doctor = doctor
        this.timezone = timezone
        this.startTime = getDateTimeFromString(`${date}T${startTime}`, timezone)
        this.endTime = addMinutesToDateTime(getDateTimeFromString(`${date}T${startTime}`, timezone), config.slotDetails.duration)
    }

    validate(){
        // field validation
        for (let key in this) {
            if (this[key] === undefined || this[key] === null) {
                throw new Error(`${key} field is required.`)
            }
        }
    }

    json(){
        return {
            date: this.date,
            startTime: this.startTime,
            endTime: this.endTime,
            doctor: this.doctor,
            timezone: this.timezone
        }
    }
}

export default Event
