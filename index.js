const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const {connectDB} = require('./db.js')
const notesRouter = require('./Routes/notesRoutes.js')
const userRouter = require('./Routes/userRoutes.js')



//ENV configuration
dotenv.config();

let app=express();
let PORT=process.env.PORT;

//Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//app.use(cors());
app.use(cors({
    origin: 'https://mmurugesan-remindify.netlify.app/', // Allow requests from your local frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    // allowedHeaders: 'Content-Type,Authorization,x-auth, id',
  }));


// Define a simple route for testing
app.get('/', (req, res) => {
    res.send('Hello, World!');
  });

//Connecting DB
connectDB();

//routes
app.use("/user",userRouter);
app.use("/notes",notesRouter);

//server connection
app.listen(PORT,()=>console.log(`Server listening on ${PORT}`));

