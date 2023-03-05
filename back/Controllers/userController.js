const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
var nodemailer = require("nodemailer");
const jwt_decode = require("jwt-decode");
const User = require("../Models/userModel");


exports.load = async (req,res) => {
  try {
    const user = req.body
    console.log(req.body)
    // const data = await User.findOne({email:user})
    // if(data){
    // return res.status(w00).json({ success: false, data });
    // }
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Please Enter Email" });
    }
    if (!password) {
      return res
        .status(400)
        .json({ success: false, message: "Please Enter Password" });
    }
    const user = await User.findOne({ email: email });
    if (user) {
      const compare = await bcrypt.compare(password, user.password);
      if (compare) {
        const token = jwt.sign({ _id: user._id }, "JWT_SECRET");
        return res
          .status(200)
          .json({ success: true, message: "Login Success", data: user, token });
      } else {
        return res
          .status(400)
          .json({ success: false, message: "Invalid Crediantials" });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Not a registered user",
      });
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }

};


exports.signup = async (req, res) => {
  console.log(req.body)
  try {
    const { email, password } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Please Enter Email" });
    }
    if (!password) {
      return res
        .status(400)
        .json({ success: false, message: "Please Enter Password" });
    }
    const fuser = await User.findOne({ email: email })
    if (!fuser) {
      const p = await bcrypt.hash(password, 12);
      const user = new User({ email, password: p, account: 'free' })
      await user.save()
      return res.status(200).json({ success: true, message: 'Signup Success! Please Login  to continue' })
    } else {
      return res.status(400).json({ success: true, message: 'User already registered' })
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }

};

