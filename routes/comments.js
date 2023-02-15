    const express = require("express");
    const router = express.Router();
    const comments = require("../schemas/comments.js");
    const posts = require("../schemas/posts")
    const authMiddleware = require("../middleware/login_middleware.js");

router.post("/:postId/comments",authMiddleware, async (req, res) => {
    const {nickname} = res.locals.user;
    const {postId} = req.params;
    const {comment} = req.body;
    const findPost = await posts.findOne({postId})
    const {userId} = findPost;
    const findMaxCommentsId = await comments.findOne({postId}).sort("-commentsId").exec();
    const commentsId = findMaxCommentsId ? findMaxCommentsId.commentsId +1 : 1;

    await comments.create({
      commentsId,
      postId,
      userId,
      nickname,
      comment
    })

    res.json({"message": "댓글을 생성하였습니다." });
});

router.get("/:postId/comments", async (req,res) => {
    const {postId} = req.params
    const com = await comments.find({postId}).sort("-commentsId")
    const commentsList = com.map((list) => {
      return {
        "commentsId" : list.commentsId,
        "postId" : list.postId,
        "nickname" : list.nickname,
        "comment" : list.comment,
        "createdAt" : list.createdAt,
        "updatedAt" : list.updatedAt,
      }
    })

    res.json({date : commentsList})
})

router.put("/:postId/comments/:commentsId",authMiddleware, async (req, res) => {
  const {userId} = res.locals.user;
  const {postId, commentsId} = req.params;
  const {comment} = req.body;
  const findComment = await comments.findOne({commentsId, postId});
  console.log(findComment)
  // if(findComment.length){
  //   await comments.updateOne(
  //           {userId, postId, commentsId},
  //           {$set:{comment:comment}},
  //       )
  // }
  findComment.comment = comment
  await findComment.save()
  res.json({ message: "댓글을 수정하였습니다." });
  
});

router.delete("/:postId/comments/:commentsId",authMiddleware, async (req,res) => {
  const {postId, commentsId} = req.params;
  await comments.deleteOne({postId, commentsId});
  res.json({message: "댓글을 삭제하였습니다."});
})


module.exports = router;