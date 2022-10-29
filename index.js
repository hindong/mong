const express = require('express')
const app = express()
const port = 8080
const { User } = require("./models/User");
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const config = require('./config/key')


app.use(express.json({extended: true}));

app.use(express.json());


mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected...')).catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/register', (req, res) =>{
    //회원가입 할때 필요한 정보들을 Clinent 에서 가져오면
    //그것들을 데이터베이스에 넣어준다 

    const user = new User(req.body);

    user.save((err, userInfo) => {
        if (err) {
            console.log(err);
            return res.json({ success: false, err })}
        return res.status(200).json({
            success: true
        })
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })