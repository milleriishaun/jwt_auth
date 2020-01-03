const router = require("express").Router();
const verify = require("./verifyToken");
const User = require("../model/User");

router.get("/", verify, async (req, res) => {
  const userPostExist = await User.findOne({ _id: req.user });
  // date represents what would be a posts list
  res.send(userPostExist.date);

  // res.json({
  //   posts: {
  //     title: "my first post",
  //     description: "random data you should not access"
  //   }
  // });
});

module.exports = router;
