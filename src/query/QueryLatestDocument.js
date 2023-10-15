const {ParkingLots,Predictions} = require('../module/parkingLots');

async function getLatestDocument() {

    try {
      // Query the latest document using the "createdAt" field
      const latestDocument = await ParkingLots.findOne()
        .sort({ createdAt: -1 })
        .lean()
        .exec();
  
      
  
        // Return the latest document with populated predictions
        return latestDocument;
      
    } catch (error) {
      console.error('Error querying the database:', error);
      throw error; // Re-throw the error so it can be handled by the caller
    }
  }

module.exports = getLatestDocument;
