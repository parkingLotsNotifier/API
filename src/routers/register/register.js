const jwt = require('jsonwebtoken');
const {User} = require('../../models/user');

module.exports = async (req,res)=>{ 
    try{
        const { username, password } = req.body;
        const user = new User({ username, password });
        const token = jwt.sign({ userId: user._id }, 'yourSecretKey');  // No expiration
        user.token = token;
        await user.save();
        res.status(200).json({ token });
         }
         catch(err){
            res.status(500).json({err: err.message});
         }
 
     
 };