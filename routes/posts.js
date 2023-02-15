const express = require("express");
const router = express.Router();
const posts = require("../schemas/posts.js");
const authMiddleware = require("../middleware/login_middleware.js")

router.post("/", authMiddleware, async (req, res) => {
  const {Id, nickname} = res.locals.user;
	const {title,content} = req.body;

try {  
      const findUserId = await posts.findOne({nickname});
      const findMaxUserId = await posts.findOne().sort("-userId").exec();
      const userId = findUserId ? findUserId.userId : findMaxUserId.userId + 1;
      const findMaxPostId = await posts.findOne().sort("-postId").exec();
      const postId = findMaxPostId ? findMaxPostId.postId +1 :1;

      if(!Id){
        res.status(403).json({errorMessage: "로그인이 필요한 기능입니다."})
        return
      }
      if(!title){
        res.status(412).json({errorMessage: "제목의 형식이 올바르지 않습니다."})
        return
      }
      if(!content){
        res.status(412).json({errorMessage: "내용의 형식이 올바르지 않습니다."})
        return
      }

      await posts.create({nickname ,title, content, userId, postId });
      res.status(201).json({"message": "게시글을 생성하였습니다." });

} catch (err){
  console.error(err);
  res.status(500).json({errorMessage: "게시글 작성에 실패했습니다."})
}
});

router.get("/", async (req,res) => {

try{
    const callAll = await posts.find().sort({"createdAt" : -1});

    if(!callAll.length){
      res.status(404).json({errorMessage: "게시글이 존재하지 않습니다."})
      return
    }

    res.json({"data":callAll});
} catch (err){
  console.error(err);
  res.status(500).json({errorMessage: "게시글 조회에 실패했습니다."})
}
})

router.get("/:postId", async (req, res) => {

    const {postId} = req.params;
try {
    const callOne = await posts.findOne({postId});

    if(!callOne){
      res.status(404).json({errorMessage: "게시글이 존재하지 않습니다."})
      return
    }
    
    res.json({ "post": callOne });
} catch (err){
  console.error(err);
  res.status(500).json({errorMessage: "게시글 조회에 실패했습니다."})
  
}
});

router.put("/:postId", authMiddleware , async (req, res) => {

  const {postId} = req.params;
  const {title,content} = req.body;
try {
  const findPost = await posts.findOne({postId})

  if(!findPost){
    res.status(404).json({errorMessage: "게시글이 존재하지 않습니다."})
    return
  }
  if(!title){
    res.status(412).json({errorMessage: "제목 형식이 올바르지 않습니다."})
    return
  }
  if(!content){
    res.status(412).json({errorMessage: "내용 형식이 올바르지 않습니다."})
    return
  }
  await posts.updateOne({postId}, {$set: {title, content}}) 
  res.json({ message: "게시글을 수정하였습니다." });
  } catch(err){
    console.error(err);
    res.status(500).json({ errmessage: '게시글 수정에 실패하였습니다.' });
  }
});

router.delete("/:postId",authMiddleware, async (req,res) => {
try{
  const {userId} = res.locals.user;
  const {postId} = req.params;
  
  const delOne = await posts.findOne({userId, postId});
  if(!delOne){
    res.status(404).json({errorMessage: "삭제할 게시물을 찾을수 없습니다."})
    return
  }
  await posts.deleteOne({userId, postId});
  res.json({message: "게시글을 삭제하였습니다."});
} catch(err){
  console.error(err);
  res.status(500).json({ errmessage: '게시글 삭제에 실패하였습니다.' });
}
})


module.exports = router;