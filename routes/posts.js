const express = require("express");
const router = express.Router();

const posts = require("../schemas/posts.js");

router.post("/", async (req, res) => {
  
	const {user,password,title,content } = req.body;

  await posts.create({ user, password, title, content });

  res.json({"message": "게시글을 생성하였습니다." });
});

router.get("/", async (req,res) => {
  const callAll = await posts.find({});
  
  const list = [];

  for (let i=0; i < callAll.length; i++){
    const post = {
      postId: callAll[i]._id,
      user: callAll[i].user,
      content: callAll[i].content,
      createdAt: callAll[i].createdAt,
    }
    list.push(post)
  }

  res.json({date : [...list]})
})

router.get("/:_postId", async (req, res) => {
  const { _postId } = req.params;
  const callOne = await posts.findById(_postId);
  const temp = {
    postId: callOne._id,
    user: callOne.user,
    title: callOne.title,
    content: callOne.content,
    createdAt: callOne.createdAt,
  };
  res.json({ data: [temp] });
});

router.put("/:_postId", async (req, res) => {
  const {password,title,content} = req.body;
    await posts.findOneAndUpdate(
      req.params._postId,
      {
        password: password,
        title: title,
        content: content,
      },
      {
        new: true,
      }
    );
    res.json({ message: "게시글을 수정하였습니다." });
});

router.delete("/:_postId", async (req,res) => {
  const {_postId} = req.params;
  const {password} = req.body;
  const delOne = await posts.findById(_postId);
  if(delOne.password=== password){
    await posts.deleteOne({_id: _postId});
    res.json({message: "게시글을 삭제하였습니다."});
  }
})


module.exports = router;