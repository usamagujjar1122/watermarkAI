const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
var nodemailer = require("nodemailer");
const jwt_decode = require("jwt-decode");
const User = require("../Models/userModel");
const {transporter} = require('../emailConfig.js')
const Stripe = require('stripe')
const stripe = Stripe(process.env.STRIPE)
const prices = [
  {"name":"monthly", "id" : "price_1Mifa5SAVfQ4595dMBXb0oeT"},
  {"name":"yearly", "id"  : "price_1MifbtSAVfQ4595dGKCVD467"},
]
exports.load = async (req, res) => {
  try {
    const {user} = req.body
    const data = await User.findOne({email:user})
    if(data){
    return res.status(200).json({ success: true, data });
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

exports.msg = async (req, res) => {
  try {
    const {email,msg,name} = req.body
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Please Enter Email" });
    }
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Please Enter Name" });
    }
    if (!msg) {
      return res
        .status(400)
        .json({ success: false, message: "Please Enter message" });
    }
    let info = await transporter.sendMail({
      from: process.env.EMAIL,
      // to: "watermarkaiofficial@gmail.com",
      to: 'itmasterusama@gmail.com',
      subject: "WatermarkAI - New msg",
      html: `
          <h1>${name}</h1>
          <h2>${email}</h2>
          <p>${msg}</p>
      `
    })
    res.status(200).json({success:true,message:'Message sent'})
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

exports.expire = async (req, res) => {
  try {
    const {user} = req.body
    console.log(user)
    const data = await User.findOneAndUpdate({email:user},{trial:false})
    if(data){
    return res.status(200).json({ success: true, data });
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}
exports.reset = async (req, res) => {
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
      const p = await bcrypt.hash(password, 12);
      await User.findOneAndUpdate({email:email},{password:p})
    return res.status(200).json({ success: true, message: "Password changed" });
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }

};

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
      const user = new User({ email, password: p, account: 'free',trial:true })
      await user.save()
      let info = await transporter.sendMail({
        from: process.env.EMAIL,
        to: user.email,
        subject: "WatermarkAI - Account created",
        html: `
            <h1>Your account was created successfully</h1>
        `
      })
      return res.status(200).json({ success: true, message: 'Signup Success! Please Login  to continue' })
    } else {
      return res.status(400).json({ success: true, message: 'User already registered' })
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }

};

exports.sendotp = async (req, res) => {
  try {
    const { email } = req.body
    console.log(email)

    if (email) {
      const user = await User.findOne({ email: email })
      if (user) {
        var otp = Math.floor(100000 + Math.random() * 900000);
        // Send Email
        let info = await transporter.sendMail({
          from: process.env.EMAIL,
          to: user.email,
          subject: "WatermarkAI - Password Reset OTP",
          html: `<h3>your otp to reset password is <h1 style="text-align:'center'">${otp}</h1></h3>`
        })
        res.send({ success: true, "message": "OTP sent", otp: otp })
      } else {
        res.send({ success: false, "message": "Email doesn't exists" })
      }
    } else {
      res.send({ success: false, "message": "Email Field is Required" })
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

exports.payment = async (req, res) => {
  const { price,plan,email } = req.body
  try{
  if (!email) {
    return res
      .status(201)
      .json({ success: false, message: "Please Enter Email" });
  }
  if (!plan) {
    return res
      .status(201)
      .json({ success: false, message: "Please Select a plan" });
  }
  const data = await User.findOne({email:email})
  const getId = () => {
    let id
    prices.map((item) => {
      if (item.name === plan) {
        id = item.id;
      }
    })
    return (id)
  }
  const sec = Math.floor(100000 + Math.random() * 900000);
  await User.findOneAndUpdate({email:email},{sec:sec})
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: getId(),
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.FRONTEND_URL}?status=success&user=${email}&plan=${plan}&sec=${sec}`,
    cancel_url: `${process.env.FRONTEND_URL}`,
  });
  res.send({ url: session.url });
} catch (error) {
  res.status(400).json({success:false,message:error.message})
}
};

exports.update = async (req,res) => {
  try {
    const {email,plan,sec} = req.body
    const data = await User.findOne({email:email})
    if(data.sec==sec){
      await User.findOneAndUpdate({email:email},{account:plan})
      res.status(200).json({success:true,message:'Subscription added successfully'})
    } else {
      res.status(400).json({success:false,message:"Inavlid attempt"})
    }
  } catch (error) {
  res.status(400).json({success:false,message:error.message})
  }
}