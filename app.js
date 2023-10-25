const express = require('express');
const util = require('util');
const bodyParser = require('body-parser');
const { PORT, DB_USERNAME, DB_PASSWORD, DB_HOST, ...rest } = require('./config/env');
const database = require('./config/database');
const router = require('./src/routers');
const { watchCollection } = require('./src/watch/changeStream');
const cors = require('cors');
const {createLogger} = require('./src/logger/logger')
const {setLatestDocument} = require('./src/controller/DocumentStorage')

const logger = createLogger('app')


database.connect(DB_USERNAME, DB_PASSWORD, DB_HOST).then(() => {
    const app = express();
    watchCollection((change) => {
        console.log(util.inspect(change, { depth: null })); 
        logger.info(util.inspect(change, { depth: null }));
        console.log(util.inspect(change, { depth: null }));
        setLatestDocument(change);  // Update the stored document
      });
    app.use(cors());
    app.use(bodyParser.json());
    app.use('/', router);
    


    app.listen(PORT, () => console.log(`example app listening on port ${PORT} ${rest.GREETING}`));
});
