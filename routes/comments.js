    const express = require("express");
    const router = express.Router();
    const comments = require("../schemas/comments.js");
    const posts = require("../schemas/posts")
    const authMiddleware = require("../middleware/login_middleware.js");

router.post("/:postId/comments",authMiddleware, async (req, res) => {
    const {nickname} = res.locals.user;
    const {postId} = req.params;
    const {comment} = req.body;
    
  try {
    const findPost = await posts.findOne({postId})
    const {userId} = findPost;

    const findMaxCommentsId = await comments.findOne({postId}).sort("-commentsId").exec();

    const commentsId = findMaxCommentsId ? findMaxCommentsId.commentsId +1 : 1;

    if(!comment){
      res.status(412).json({ errormessage: "데이터 형식이 올바르지 않습니다." });
      return
    }

    await comments.create({
      commentsId,
      postId,
      userId,
      nickname,
      comment
    })
    res.json({"message": "댓글을 생성하였습니다." });
    
  } catch(err){
    console.error(err);
    res.status(500).json({ errmessage: '댓글 생성에 실패하였습니다.' });
  }
});

router.get("/:postId/comments", async (req,res) => {
    const {postId} = req.params
try {
    const com = await comments.find({postId}).sort("-commentsId")
    if(!com.length){
      res.status(404).json({ errormessage: "댓글이 존재하지 않습니다." });
      return
    }
    res.json({date : com})

} catch(err){
  console.error(err);
  res.status(500).json({ errmessage: '댓글 조회에 실패하였습니다.' });
}
})

router.put("/:postId/comments/:commentsId",authMiddleware, async (req, res) => {
try {
  const {userId} = res.locals.user;
  const {postId, commentsId} = req.params;
  const {comment} = req.body;
  const findComment = await comments.findOne({commentsId, postId});

  if(findComment.length ===0){
    return res.status(404).json({ errmessage: '댓글이 존재하지 않습니다.' });
  }
  if(findComment.userId !== userId){
    res.status(403).json({ errmessage: '로그인이 필요한 기능입니다.' }); 
    return
  }
  if (!comment) {
    res.status(412).json({ errmessage: '데이터 형식이 올바르지 않습니다.' });
    return
  }
  
  
  findComment.comment = comment
  await findComment.save()
  res.json({ message: "댓글을 수정하였습니다." });
} catch(err){
  console.error(err);
  res.status(500).json({ errmessage: '댓글 수정에 실패하였습니다.' });
}
});

router.delete("/:postId/comments/:commentsId",authMiddleware, async (req,res) => {
  const {userId} = res.locals.user;
  const {postId, commentsId} = req.params;
try{
  const comment = await comments.findOne({postId,commentsId})

  if(findComment.userId !== userId){
    res.status(403).json({ errmessage: '로그인이 필요한 기능입니다.' }); 
    return
  }
  if (!comment) {
    res.status(412).json({ errmessage: '댓글이 존재하지 않습니다.' });
    return
  }
  await comments.deleteOne({postId, commentsId});
  res.json({message: "댓글을 삭제하였습니다."});
  
} catch(err){
  console.error(err);
  res.status(500).json({ errmessage: '댓글 삭제에 실패하였습니다.' });
}
})


module.exports = router;