const express = require('express');


const welcome=require(`./welcome`);
const publishLatestDocument = require(`./publishLatestDocument`)
const register = require('../register/register')
const router = express.Router();

//the available endpoints api/...

router.get(`/`,welcome);
router.post('/publishLatestDocument',publishLatestDocument);

module.exports = router;





