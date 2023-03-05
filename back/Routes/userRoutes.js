const express = require('express')
const router = express.Router()
const {login,signup,load} = require("../Controllers/userController")

router.post('/login',login)
router.post('/signup',signup)
router.post('/load',load)




module.exports = router