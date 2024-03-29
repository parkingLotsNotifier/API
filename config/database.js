const mongoose = require(`mongoose`);

const connect = async (username,password,host)=>{
    const uri =`mongodb+srv://${username}:${password}@${host}?retryWrites=true&w=majority`;
    await mongoose.connect(uri ,{ useNewUrlParser: true, useUnifiedTopology: true });
    await mongoose.set('strictQuery', false)
    console.log(`connected to database`);
};

module.exports={connect};
