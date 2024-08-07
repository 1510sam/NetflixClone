const express = require("express");
const CryptoJS = require("crypto-js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

router.post("/register", async (req, res) => {
  var salt = bcrypt.genSaltSync(10);
  var hashPass = bcrypt.hashSync(req.body.password, salt);
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashPass,
  });

  try {
    const user = await newUser.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    // Tìm người dùng dựa trên email
    const user = await User.findOne({ email: req.body.email });

    // Kiểm tra nếu không tìm thấy người dùng
    if (!user) {
      return res.status(401).json("Wrong password or username!");
    }

    // So sánh mật khẩu
    const isPassCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPassCorrect) {
      return res.status(401).json("Wrong password or username!");
    }

    // Tạo access token
    const accessToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.SECRET_KEY,
      { expiresIn: "5d" }
    );

    // Loại bỏ mật khẩu khỏi đối tượng trả về
    const { password, ...info } = user._doc;

    // Trả về thông tin người dùng và token
    res.status(200).json({ ...info, accessToken });
  } catch (err) {
    console.error(err);
    res.status(500).json("Internal server error");
  }
});

module.exports = router;
