const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI ;

app.use(cors());
app.use(express.json());
app.get('/', (req, res) => { 
  res.send('Hello from Node.js backend ');
});

const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173','https://65b76bf0-880f-41af-bc78-6bf9930d0b4e-00-j7693vnjf8yw.sisko.replit.dev:3000/'];



app.use('/api', require('./routes/authRoutes'));


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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});