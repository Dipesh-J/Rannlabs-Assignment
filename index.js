const express = require("express");
const app = express();
const mongoose = require("mongoose");
const route = require("./src/routes/route");
const env = require("dotenv");
const errorHandler = require("./src/middlewares/errorHandler")

app.use(errorHandler);
app.use(express.json());

mongoose.connect(process.env.MONGO_CONNECTION_STRING)
.then(()=> console.log("MongoDb is connected"))
.catch((err)=> console.log(err));

app.use("/", route);

const port = process.env.PORT || 3000;
app.listen( port, ()=>{
    console.log(`Express app is running on port ${port}`);
})