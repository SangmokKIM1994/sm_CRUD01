const express = require("express");
const router = express.Router();
const posts = require("../schemas/posts.js");
const authMiddleware = require("../middleware/login_middleware.js")

router.post("/", authMiddleware, async (req, res) => {
  const {nickname} = res.locals.user;
	const {title,content} = req.body;

  const findUserId = await posts.findOne({nickname});
  const findMaxUserId = await posts.findOne().sort("-userId").exec();
  const userId = findUserId ? findUserId.userId : findMaxUserId + 1;
  const findMaxPostId = await posts.findOne().sort("-postId").exec();
  const postId = findMaxPostId ? findMaxPostId.postId +1 :1;
  
  
  await posts.create({nickname ,title, content, userId, postId });

  res.status(201).json({"message": "게시글을 생성하였습니다." });
});

router.get("/", async (req,res) => {
  const callAll = await posts.find().sort({"createdAt" : -1});
  
  const postList = callAll.map((post) => {
    return {
      "postId": post.postId,
      "userId": post.userId,
      "nickname": post.nickname,
      "content": post.content,
      "createdAt": post.createdAt,
      "updatedAt": post.updatedAt,
    };
  });
  res.json({"data":postList});
})

router.get("/:postId", async (req, res) => {
  const {postId} = req.params;
  const callOne = await posts.findOne({postId});
  const temp = {
    postId: callOne.postId,
    userId: callOne.userId,
    title: callOne.title,
    content: callOne.content,
    createdAt: callOne.createdAt,
    updatedAt: callOne.updatedAt,
  };
  res.json({ "post": temp });
});

router.put("/:postId", authMiddleware , async (req, res) => {
  const {userId} = res.locals.user;
  const {postId} = req.params;
  const {title,content} = req.body;
  const findPost = await posts.findOne({postId})
  await posts.updateOne({postId}, {$set: {title, content}}) 
  res.json({ message: "게시글을 수정하였습니다." });
});

router.delete("/:postId",authMiddleware, async (req,res) => {
  const {userId} = res.locals.user;
  const {postId} = req.params;
  
  // const delOne = await posts.findOne({userId, postId});
  await posts.deleteOne({userId, postId});
  res.json({message: "게시글을 삭제하였습니다."});
})


module.exports = router;