const express = require("express");
// const { route } = require("./goods");
const router = express.Router();
const UserSchema = require("../schemas/user.js") //스키마를 들고 왔어야 하는데 안들고옴
// const authMiddleware = require("../middlewares/auth_middlesare.js");

router.post("/", async (req, res) => {
    const {nickname, password, confirm} = req.body;
    const findNickname = await UserSchema.findOne({nickname});
    const passwordInNickname = await password.includes(nickname)
    const nicknameCheck = await nickname.match(/[^0-9a-zA-Z]/g)

    if(password !== confirm){ 
        res.status(412).json({errorMessage : "비밀번호 확인이 일치하지 않습니다.",})
        return
    };
    if(findNickname){
        res.status(412).json({errorMessage : "중복된 닉네임 입니다.",})
        return
    };
    if(nickname.length < 3 || nicknameCheck){
        res.status(412).json({errorMessage : "닉네임 형식이 일치하지 않습니다.",})
        return
    }
    if(password.length < 4){
        res.status(412).json({errorMessage : "패스워드 형식이 일치하지 않습니다.",})
        return
    }
    if(passwordInNickname){
        res.status(412).json({errorMessage : "패스워드에 닉네임이 포함되어 있습니다.",})
        return
    }

    const user = new UserSchema({nickname,password});
    await user.save();
    res.status(201).json({messege : "회원 가입에 성공하였습니다."});
    
})

module.exports = router