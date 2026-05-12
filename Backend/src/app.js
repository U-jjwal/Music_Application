import express from 'express';
import cookieParser from 'cookie-parser';
import authrouter from './routes/auth.route.js';
import musicrouter from './routes/music.routes.js';
import cors from 'cors'
import dotenv from 'dotenv';
import connectDb from './db/db.js';

dotenv.config()

const app = express();

app.use(cors({
    origin: process.env.FROENTEND_URL,
    credentials: true
    
}));

app.use( async (req, res, next) => {
    console.log("Connecting to database...");
    await connectDb();
    next();
})

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


app.use('/api/auth', authrouter);
app.use('/api/music', musicrouter);

app.get('/', (req, res) => {
    console.log("working")
    res.send("Welcome")
})


export default app;