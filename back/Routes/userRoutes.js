const express = require('express')
const router = express.Router()
const {login,signup,load,sendotp,reset,payment,update,expire,msg} = require("../Controllers/userController")

router.post('/login',login)
router.post('/signup',signup)
router.post('/load',load)
router.post('/sendotp',sendotp)
router.post('/reset',reset)
router.post('/payment',payment)
router.post('/update',update)
router.post('/expire',expire)
router.post('/msg',msg)




module.exports = router