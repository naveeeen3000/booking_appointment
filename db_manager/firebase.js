import config from "../config.js";
import { cert, initializeApp } from "firebase-admin/app";

const firebase = initializeApp({credential: cert(config.firebaseConfig)});
console.log("connected to firebase")

    
export default firebase
