const express = require('express');
const bodyParser = require('body-parser');
const { PORT, DB_USERNAME, DB_PASSWORD, DB_HOST, ...rest } = require('../config/env');
const database = require('../config/database');
const router = require('./routers');
const {scheduleQuery} = require('../src/scheduler/ScheduleQuery');
const cors = require('cors');

let latestDocument = null;
database.connect(DB_USERNAME, DB_PASSWORD, DB_HOST).then(() => {
    const app = express();
    scheduleQuery();
    app.use(cors());
    app.use(bodyParser.json());
    app.use('/', router);
    


    app.listen(PORT, () => console.log(`example app listening on port ${PORT} ${rest.GREETING}`));
});
