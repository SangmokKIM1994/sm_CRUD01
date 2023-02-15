const express = require("express");
const router = express.Router();
const User = require("../schemas/user.js");
const jwt = require("jsonwebtoken");

router.post("/", async(req,res) => {
    const {nickname, password} = req.body;
    const check = await User.findOne({nickname});

    if(!check || check.password !== password){
        res.status(412).json({errorMassege : "닉네임 또는 패스워드를 확인해주세요"})
    }

    const token = jwt.sign({Id: check.Id},"customized-secret-key");

    res.cookie("Authorization", `Bearer ${token}`);
    res.status(200).json({token : token})
});


module.exports = router;