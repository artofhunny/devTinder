const experss = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { validateSignupData } = require("../utils/validation");
const User = require("../model/user");

const router = experss.Router();

router.post("/signup", async (req, res) => {
  try {
    validateSignupData(req);

    const {
      firstName,
      lastName,
      emailId,
      password,
      age,
      gender,
      photoUrl,
      skills,
      about,
    } = req.body;

    const hashPassword = await bcrypt.hash(password, 10);

    const dataObj = {
      firstName,
      lastName,
      emailId,
      password: hashPassword,
      age,
      gender,
      photoUrl,
      skills,
      about,
    };

    const user = new User(dataObj);
    const savedUser = await user.save();

    const token = await jwt.sign(
      { _id: savedUser._id },
      process.env.JWT_SECRET
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ message: "User added successfully", data: savedUser });
  } catch (err) {
    res.status(400).send("Error saving the user: " + err.message);
  }
});

// Signin api

router.post("/login", async (req, res) => {
  const { emailId, password } = req.body;

  try {
    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.send({ message: "Login successfully", data: user });
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("error in login : " + err.message);
  }
});

router.post("/logout", (req, res) => {
  // res.cookie("token", null, {
  //   expires: new Date(Date.now()),
  // });

  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    expires: new Date(0),
  });

  res.send("Logout successfull!");
});

module.exports = router;
