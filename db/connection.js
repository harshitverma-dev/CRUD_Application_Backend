require('dotenv').config();
const mongoose = require('mongoose');
const DB = process.env.DATABASE;

mongoose.set('strictQuery', true);

mongoose.connect(DB)
    .then(() => {
        console.log('DB connected...')
    })
    .catch((err) => {
        console.log(`the error is ${err}`);
    })