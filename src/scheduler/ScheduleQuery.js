const util = require('util');
const schedule = require('node-schedule');
const getLatestDocument = require('../query/QueryLatestDocument');
const { setLatestDocument } = require('../controller/DocumentStorage');

function scheduleQuery() {
  const job = schedule.scheduleJob('*/1 * * * *', async function() {
    try {
      const latestDocument = await getLatestDocument();
      if (latestDocument) {
        console.log(util.inspect(latestDocument, { depth: null }));
        setLatestDocument(latestDocument);  // Update the stored document
      } else {
        console.log('No documents found.');
      }
    } catch (error) {
      console.error('Error in scheduled job:', error);
    }
  });
}

module.exports = {
  scheduleQuery
};
