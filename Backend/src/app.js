import express from 'express';
import cookieParser from 'cookie-parser';
import authrouter from './routes/auth.route.js';
import musicrouter from './routes/music.routes.js';
import cors from 'cors'
import dotenv from 'dotenv';

dotenv.config()

const app = express();


app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use('/api/auth', authrouter);
app.use('/api/music', musicrouter);

app.get('/', (req, res) => {
    console.log("working")
    res.send("Welcome")
})


export default app;