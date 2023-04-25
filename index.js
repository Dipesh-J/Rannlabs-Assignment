const express = require("express");
const mongoose = require("mongoose");
const multer  = require("multer");
const env = require("dotenv");
env.config();

const app = express();
const route = require("./src/routes/route");

const errorHandler = require("./src/middlewares/errorHandler")

app.use(multer().any());
app.use(express.json());

mongoose.connect(process.env.MONGO_CONNECTION_STRING)
.then(()=> console.log("MongoDb is connected"))
.catch((err)=> console.log(err));

app.use("/", route);
app.use(errorHandler);


const port = 3000 || process.env.PORT;
app.listen( port, ()=>{
    console.log(`Express app is running on port ${port}`);
})