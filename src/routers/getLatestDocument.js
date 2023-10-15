const {getStoredDocument} = require('../controller/DocumentStorage')
module.exports = async (req,res)=>{ 
    try{
        const latestDocument = await getStoredDocument();
        res.status(200).json(latestDocument);  
         }
         catch(err){
             res.status(500).json({err: err.message});
         }
 
     
 };