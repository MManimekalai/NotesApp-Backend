const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const {connectDB} = require('./db.js')
const dbConnection = require('./db.js')
const notesRouter = require('./Routes/notesRoutes.js')
const userRouter = require('./Routes/userRoutes.js')



//ENV configuration
dotenv.config();

let app=express();
let PORT=process.env.PORT;

//Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

//Connecting DB
connectDB();

//routes
//app.use("/user",userRouter);
//app.use("/notes",notesRouter);

//server connection
app.listen(PORT,()=>console.log(`Server listening on ${PORT}`));

