const express = require('express');


const welcome=require(`./welcome`);
const register = require('./register')
const router = express.Router();

//the available endpoints auth/...

router.get(`/`,welcome);
router.post('/register',register);
module.exports = router;





