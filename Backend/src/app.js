import express from 'express';
import cookieParser from 'cookie-parser';
import authrouter from './routes/auth.route.js';
import musicrouter from './routes/music.routes.js';
import cors from 'cors'

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use('/api/auth', authrouter);
app.use('/api/music', musicrouter);

app.get('/api', (req, res) => {
    console.log("working")
    res.send("Welcome")
})


export default app;