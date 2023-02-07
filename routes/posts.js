const express = require("express");
const router = express.Router();

router.get("/posts", (req,res) => {
    res.json({posts: posts});
  })

  router.get("/posts/:postId", (req,res) => {
    const {postId} = req.params;
    const [detail] = goods.filter((posts)=> posts.postId === Number(postId));
    res.json({detail})
  })

router.post("/posts", async (req, res) => {
	const { postId, user, password, title, content } = req.body;

  const posts = await Goods.find({ postId });
  if (posts.length) {
    return res.status(400).json({ success: false, 
        errorMessage: "이미 있는 ID입니다." });
  }

  const createdPosts = await Goods.create({ postId, user, password, title, content });

  res.json({ posts: createdPosts });
});

module.exports = router;