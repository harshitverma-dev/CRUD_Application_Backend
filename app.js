require('dotenv').config();
require('./db/connection')
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const PORT = process.env.PORT || 5000;
const mongoose = require('mongoose');
const userRoute = require('./Routes/userRoute')

// middlewear
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use(userRoute);
app.use('/upload', express.static('./upload'));
app.use('/files', express.static('./public/files'));

app.listen(PORT, () => {
    console.log(`app is runing on ${PORT}`)
})