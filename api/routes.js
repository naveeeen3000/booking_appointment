import express from "express"
import VIEWS from "./views.js"

const router = express.Router()

router.get("/free-slots",[], VIEWS.getFreeSlotsView)
router.post('/book-event', [], VIEWS.bookEventView)
router.get("/events", [], VIEWS.getEventsView)

export default router;
