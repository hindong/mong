const express = require('express');
const app = express();
const port = 8080;
const { User } = require("./models/User");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config/key');
const cookieParser = require('cookie-parser');
const {auth} = require('./middleware/auth');


app.use(express.json({extended: true}));

app.use(express.json());

//application/json
app.use(bodyParser.json());
app.use(cookieParser());


mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('api/users/register', (req, res) =>{
    //회원가입 할때 필요한 정보들을 Clinent 에서 가져오면
    //그것들을 데이터베이스에 넣어준다 

    const user = new User(req.body);

    user.save((err, userInfo) => {
        if (err) {
            console.log(err);
            return res.json({ success: false, err });}
        return res.status(200).json({
            success: true
        })
    })
});

app.post('/api/users/login', (req, res) =>{

    // 요청된 이메일이 DB에 있는지 확인한다.
    User.findOne({email : req.body.email}, (err, user)=>{
        if(!user){
            return res.json({
                loginSuccess: false,
                message: "이메일에 해당하는 유저가 없습니다."
            });
        }

        // 이메일이 DB에 있다면 비밀번호가 맞는지 확인한다.
        user.comparePassword(req.body.password, (err, isMatch) =>{
        // 비밀번호가 틀리다면
        if(!isMatch){
            return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."});
        }   
        
        // 모두 맞다면 토큰을 생성한다.
        user.generateToken((err, user)=>{
            if(err) return res.status(400).send(err);

            // 토큰을 저장한다. (쿠키 or 로컬 스토리지)
            res.cookie("x_auth", user.token)
            .status(200)
            .json({loginSuccess: true, userId: user._id});

        });
    });
    });
});

app.get('/api/users/auth', auth ,(req, res) => {

    //Authentication이 true라면
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image,
    });
});

app.get('/api/users/logout', auth, (req, res) =>{

    User.findOneAndUpdate({_id: req.user._id}, 
    {token: ""},
    (err, user)=> {
        if(err) return res.json({success: false, err});
        return res.status(200).send({
            success:true,
        });
        }
    );
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });