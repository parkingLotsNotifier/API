const {getStoredDocument} = require('../controller/DocumentStorage')
const {createLogger} = require('../logger/logger')

let logger= createLogger("getStoredDocument");
module.exports = async (req,res)=>{ 
    try{
        const latestDocument = await getStoredDocument();
        logger.info('from getStoredDocument : found latestDocument')
        res.status(200).json(latestDocument);  
         }
         catch(err){
            ogger.error(`from getStoredDocument : ${JSON.status()}`) 
            res.status(500).json({err: err.message});
         }
 
     
 };