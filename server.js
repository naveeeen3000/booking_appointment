import express from 'express'
import cors from 'cors'
import router from "./api/routes.js";
import config  from "./config.js"

const app = express()
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/health-check", (req, res)=>{
    res.send({"message": "Ok"})
});

app.use("/api", router);

const PORT = config.port || 3000;
app.listen(PORT, () => {
    console.log(`Listening for requests on port ${PORT}`)
})
