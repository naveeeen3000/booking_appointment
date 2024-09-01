import assert from 'assert';
import dotenv from "dotenv";
dotenv.config()

const {
    PORT,
    project_id,
    private_key_id,
    private_key,
    client_id,
    client_email
} = process.env

const slotDetails = {
    duration: 30, //in minutes,
    timezone: 'Asia/Kolkata',
    startTime: "10:00:00",
    endTime: "20:00:00"
}

assert(PORT, "Port is required")

export default {
    port: PORT,
    slotDetails,
    firebaseConfig: {
        projectId: project_id,
        privateKey: private_key,
        privateKeyId: private_key_id,
        clientID: client_id,
        clientEmail: client_email
    }
}
