const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const Schema = mongoose.Schema;

const userSchema = new Schema ({ 
 username: String,
 password: String, 
 token: String 
});

const User = mongoose.model('User',userSchema)
module.exports = {
    User
} 
