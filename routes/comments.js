    const express = require("express");
    const router = express.Router();

    const comments = require("../schemas/comments.js");

router.post("/:_postId", async (req, res) => {
    const {_postId} = req.params;
    const {user,password,content } = req.body;

    await comments.create({ postId: _postId, user, password, content });

    res.json({"message": "댓글을 생성하였습니다." });
});

router.get("/:_postId", async (req,res) => {
    const {_postId} = req.params
    const callAll = await comments.find({postId:_postId});
  
    const list = [];

    for (let i=0; i < callAll.length; i++){
        const comment = {
        commentId: callAll[i]._id,
        user: callAll[i].user,
        content: callAll[i].content,
        createdAt: callAll[i].createdAt,
        }
        list.push(comment)
    }

    res.json({date : list})
})

router.put("/:_commentId", async (req, res) => {
  const {password,content} = req.body;
    await comments.findOneAndUpdate(
      req.params._commentId,
      {
        password: password,
        content: content,
      },
      {
        new: true,
      }
    );
    res.json({ message: "댓글을 수정하였습니다." });
  
});

router.delete("/:_commentId", async (req,res) => {
  const {_commentId} = req.params;
  const {password} = req.body;
  const delOne = await comments.findById(_commentId);
  if(delOne.password=== password){
    await comments.deleteOne({_id: _commentId});
    res.json({message: "댓글을 삭제하였습니다."});
  }
})


module.exports = router;