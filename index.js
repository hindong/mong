const express = require("express");
const app = express();
const port = 4040;
const bodyParser = require('body-parser');
const { User } = require('./models/User');
const config = require('./config/key');

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI,
).then(() => console.log('MongoDB Connected...'))
 .catch(err => console.log(err));

// application
app.use(bodyParser.urlencoded({extended : true}));
// application/json
app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.send("totoga...");
})

app.post('/register', (req, res) => {
    
    // 회원가입 정보를 받아 데이터베이스로 넣어준다.
    const user = new User(req.body)
    user.save((err, userInfo) => {
        if(err) return res.json( { success: false, err})
        return res.status(200).json({
            success: true
        })
    })
})


app.listen(port, () => {
    console.log('server start...');
})

