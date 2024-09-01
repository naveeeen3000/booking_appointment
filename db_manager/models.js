import { getDateTimeFromString } from "../api/utils.js"

class Event {
    constructor({date, doctor, startTime, endTime, timezone}){
        this.date = getDateTimeFromString(`${date}`, timezone)
        this.doctor = doctor
        this.timezone = timezone
        this.startTime = getDateTimeFromString(`${date}T${startTime}`, this.timezone)
        this.endTime = getDateTimeFromString(`${date}T${endTime}`, this.timezone)
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
