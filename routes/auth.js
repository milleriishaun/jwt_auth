const router = require("express").Router();
const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { registerValidation, loginValidation } = require("../validation");

router.post("/register", async (req, res) => {
  // Validate the data before adding the user
  const validation = registerValidation(req.body);
  if (validation.error) {
    const error = validation.error.details[0].message;
    return res.status(400).send(error);
  }

  // Deconstruct payload
  const { name, email, password } = req.body;

  // Check if the user is already in the DB
  const emailExist = await User.findOne({ email: email });
  if (emailExist) {
    return res.status(400).send("Email already exists");
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create a new user
  const user = new User({
    name: name,
    email: email,
    password: hashedPassword
  });

  try {
    const savedUser = await user.save();
    res.send({ user: user._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

// Login
router.post("/login", async (req, res) => {
  // Validate the data before adding the user
  const validation = loginValidation(req.body);
  if (validation.error) {
    const error = validation.error.details[0].message;
    return res.status(400).send(error);
  }

  // Deconstruct payload
  const { name, email, password } = req.body;

  // Check if user email is already in the DB
  const wholeUser = await User.findOne({ email: email });
  if (!wholeUser) {
    return res.status(400).send("Email or password is invalid");
  }
  // Password is correct
  const validPassword = await bcrypt.compare(password, wholeUser.password);
  if (!validPassword) {
    return res.status(400).send("Email or password is invalid");
  }

  // Create and assign a token
  const token = jwt.sign({ _id: wholeUser._id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).send(token);

  // res.send("Logged in!");
});

module.exports = router;
