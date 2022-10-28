const express = require("express");
const app = express();
const port = 4030;

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://gowls980807:gowls20170612@bolierpalte.lyqgnuw.mongodb.net/?retryWrites=true&w=majority',
).then(() => console.log('MongoDB Connected...'))
 .catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send("start...");
})

app.listen(port, () => {
    console.log('server start...');
})

