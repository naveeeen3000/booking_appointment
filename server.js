import express from 'express';
import cors from 'cors';
import router from "./api/routes.js";
import config  from "./config.js";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, './dist')));

app.get("/health-check", (req, res)=>{
    res.send({"message": "Ok"})
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./dist", 'index.html'));
})

app.use("/api", router);

const PORT = config.port || 3000;
app.listen(PORT, () => {
    console.log(`Listening for requests on port ${PORT}`)
})
