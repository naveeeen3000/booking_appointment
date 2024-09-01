import {
    successResponse,
    errorResponse,
    getFreeSlots,
    logger
} from "./utils.js";
import { insertEvent, getBookedEvents, getEvents } from "../db_manager/queries.js";

const getFreeSlotsView = async (req, res) => {
    try{
        const {date, timezone} = req.query;
        logger.info("View: getFreeSlotsView", {data: [date, timezone]});
        const bookedSlots = await getBookedEvents(date, timezone);
        const freeSlots = getFreeSlots(bookedSlots, date);
        const response = successResponse("Successfully fetched free slots", freeSlots);
        return res.send(response.data).status(response.httpStatus);
    } catch (err) {
        logger.error(`Error in getFreeSlotsView: ${err}`);
        const response = errorResponse("Error in getting free slots");
        return res.send(response.data).status(response.httpStatus);
    }
}

const bookEventView = async (req, res) => {
    const data = req.body;
    logger.info("View: bookEventView", data);
    try{
        await insertEvent(data);
        let response = successResponse("created event successfully");
        return res.send(response.data).status(response.httpStatus);
    } catch(err) {
        logger.error(`Error in bookEventsView ${err}`, data)
        const response = errorResponse(
            err.message ? err.message : "Error in booking the event"
        )
        return res.send(response.data).status(response.httpStatus);
    }
}

const getEventsView = async (req, res) => {
    try{
        const {startDate, endDate} = req.query;
        logger.info("View: getEventsView", {data: [startDate, endDate]})
        const events = await getEvents(startDate, endDate);
        const response = successResponse("Successfully fetched events", events);
        return res.send(response.data).status(response.httpStatus);
    } catch(err){
        logger.error(`Error in bookEventsView ${err}`, data)
        const response = errorResponse(
            err.message ? err.message : "Error in booking the event"
        )
        return res.send(response.data).status(response.httpStatus); 
    }
}

export default {
    getFreeSlotsView,
    bookEventView,
    getEventsView
}