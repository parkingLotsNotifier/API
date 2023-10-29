module.exports = async (req,res)=>{ 
   try{
         res.status(200).json("welcome to my restful web service");
        }
        catch(err){
            res.status(500).json({err: err.message});
        }

    
};

