const bcrypt = require("bcrypt");
const { User, decodeJwtToken, generateJwtToken } = require("../Models/User.js");

const signUp = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user)
      return res.status(400).json({ message: "Email already registered" });

    let Salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(req.body.password, Salt);

    let newuser = await new User({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: hashedPassword,
    }).save();

    let token = generateJwtToken(newuser._id);
    res.status(200).json({ message: "SignUp successfully", token });
  } catch (error) {
    console.log("Error in Signup", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ message: "Invalid Credentials" });

    let validatePassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validatePassword)
      return res.status(400).json({ message: "Invalid Credentials" });

    let token = generateJwtToken(user._id);
    res.status(200).json({ message: "Login successfully", token });
  } catch (error) {
    console.log("Error in Login", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    let email = req.body.email;
    let user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ message: "Invalid Credentials" });

    let Salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(req.body.password, Salt);

    let updatePassword = await User.findOneAndUpdate(
      { email: email },
      { $set: { password: hashedPassword } },
      { new: true }
    );

    let token = generateJwtToken(user._id);
    res.status(200).json({ message: "Password Reseted Successfully", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getUserDataByToken = async (req, res) => {
  try {
    let token = req.headers["x-auth"];
    let userId = decodeJwtToken(token);
    let user = await User.findById({ _id: userId });

    res.status(200).json({ message: "User Data Got Successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getUserDataByEmail = async (req, res) => {
  try {
    let email = req.headers["email"];
    let user = await User.findOne({ email: email });
    res.status(200).json({ message: "User Data Got Successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {signUp, login, getUserDataByEmail, getUserDataByToken, resetPassword}