const mongoose = require("mongoose");
mongoose.set('strictQuery',false)
const dotenv = require('dotenv');
dotenv.config();
const {mongoDb} = process.env

const connect = () => {
    mongoose
    .connect(mongoDb,{useNewUrlParser: true,
                     useUnifiedTopology: true,})
    .then(()=>console.log('몽고디비 연결'))
    .catch(err => console.log(err));
};

mongoose.connection.on("error", err => {
    console.error("몽고디비 연결 에러", err);
});

module.exports = connect