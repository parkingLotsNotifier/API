const express = require('express');


const welcome=require(`./welcome`);
const getLatestDocument = require(`./getLatestDocument`)
const router = express.Router();

//the available endpoints users/...

router.get(`/`,welcome);
router.get('/api/getLatestDocument',getLatestDocument)

module.exports = router;





