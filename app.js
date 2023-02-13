const express = require('express');
const cookieParser = require("cookie-parser");
const app = express();
const port = 3000;

const postRouter = require('./routes/posts.js');
const commentRouter = require("./routes/comments.js");
const signupRouter = require("./routes/user.js");
const loginRouter = require("./routes/login.js")

const connect = require("./schemas/index.js");


connect();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/signup",[signupRouter]);
app.use("/login",[loginRouter]);
app.use("/posts", [postRouter]);
app.use("/comments", [commentRouter])

app.listen(port, () => {
    console.log(port, '포트로 서버가 열렸어요!');
  });

app.get('/', (req, res) => {
    res.send('Hello World!');
  });