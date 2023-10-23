const util = require('util');
const schedule = require('node-schedule');
const getLatestDocument = require('../query/QueryLatestDocument');
const { setLatestDocument } = require('../controller/DocumentStorage');
const {createLogger} = require('../logger/logger')

let logger= createLogger("scheduleQuery");

function scheduleQuery() {
  const job = schedule.scheduleJob('*/1 * * * *', async function() {
    try {
      const latestDocument = await getLatestDocument();
      if (latestDocument) {
        logger.info(util.inspect(latestDocument, { depth: null }));
        console.log(util.inspect(latestDocument, { depth: null }));
        setLatestDocument(latestDocument);  // Update the stored document
      } else {
        logger.error('No documents found.');
      }
    } catch (error) {
      logger.error('Error in scheduled job:', error);
    }
  });
}

module.exports = {
  scheduleQuery
};
