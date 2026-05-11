import dotenv from 'dotenv'
import app from './src/app.js'
import connectDb from './src/db/db.js'

dotenv.config()

connectDb()
.then(() => {
    app.listen(process.env.PORT, () =>{
    
    console.log(`Server is running on port ${process.env.PORT}`);
})
}).catch((error) => {
    console.error("Error connecting to database:", error);
});

