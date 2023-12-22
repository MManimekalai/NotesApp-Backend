const bcrypt = require("bcrypt");
// const {decodeJwtToken, generateJwtToken } = require("../Models/User.js");
const User = require('../Models/User.js')
const {connectDB} = require('../db.js')
const jwt = require('jsonwebtoken')



const signUp = async (req, res) => {
  await connectDB()
  console.log('test1');
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user)
      return res.status(400).json({ message: "Email already registered" });

    let Salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(req.body.password, Salt);

    let newuser = new User({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: hashedPassword,
    })
    console.log('newuser');


    let token = generateJwtToken(newuser._id);
    console.log('test3');

    await newuser.save();

    res.status(200).json({ message: "SignUp successfully", token });
  } catch (error) {
    console.log("Error in Signup", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  await connectDB()
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
  await connectDB()
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
  await connectDB()
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
  await connectDB()
  try {
    let email = req.headers["email"];
    let user = await User.findOne({ email: email });
    res.status(200).json({ message: "User Data Got Successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//Generate JWT token
let generateJwtToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY);
};

//Decode Jwt Token
const decodeJwtToken = (token) => {
  try {
    let decoded = jwt.verify(token, process.env.SECRET_KEY);
    return decoded.id;
  } catch (error) {
    console.error("Error in Jwt Decoding", error);
    return null;
  }
};

module.exports = {signUp, login, getUserDataByEmail, getUserDataByToken, resetPassword}