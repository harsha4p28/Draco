const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require("cookie-parser");


require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI ;

app.use(express.json());
app.use(cookieParser());


const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173','https://65b76bf0-880f-41af-bc78-6bf9930d0b4e-00-j7693vnjf8yw.sisko.replit.dev:3000'];



mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.error('MongoDB connection error:', err));

app.use(
    cors({
        origin: (origin, callback)=>{
            if(!origin || allowedOrigins.includes(origin)){
                callback(null,true);
            }else{
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
    }) 
);

app.use('/api', require('./routes/authRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});