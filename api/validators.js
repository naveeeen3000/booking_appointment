import { body, query } from "express-validator";

const createEventValidator = [
    body('date').exists().withMessage("Date is required").isISO8601().withMessage('Invalid date format, must be ISO 8601'),
    body('doctor').exists().withMessage("Doctor is required"),
    body('startTime').exists().withMessage("startTime is required"),
    body('duration').exists().withMessage("Duration is required"),
    body('timezone').exists().withMessage("timezone is required")
]

export {
    createEventValidator,
}