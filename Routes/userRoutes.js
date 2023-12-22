const express = require("express");
const {
  signUp,
  login,
  resetPassword,
  getUserDataByToken,
  getUserDataByEmail,
} = require("../Controllers/userController")

let router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.put("/reset-password", resetPassword);
router.get("/get-user-data", getUserDataByToken);
router.get("/get-user-data-by-email", getUserDataByEmail);

module.exports = router;
