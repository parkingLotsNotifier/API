const express = require('express');
const util = require('util');
const bodyParser = require('body-parser');
const { PORT, DB_USERNAME, DB_PASSWORD, DB_HOST, ...rest } = require('./config/env');
const database = require('./config/database');
const router = require('./src/routers/publisher');
const register = require('./src/routers/register');
const { watchCollection } = require('./src/watch/changeStream');
const cors = require('cors');
const {createLogger} = require('./src/logger/logger')
const {setLatestDocument} = require('./src/controller/DocumentStorage')
const {authenticateTokenHTTP} = require('./src/autentication/autenticationHTTP');
const logger = createLogger('app')
const http = require('http');
const WebSocket = require('ws');
const {authenticateTokenWebSock} = require('./src/autentication/authenticateWebSock');

database.connect(DB_USERNAME, DB_PASSWORD, DB_HOST).then(() => {
    const app = express();
    app.use(cors());
    app.use(bodyParser.json());
    
    app.use('/auth', register);
    
    app.use(authenticateTokenHTTP);

    app.use('/',router)

    const server = http.createServer(app);
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws,request) => {
      const token = new URL(request.url, `http://${request.headers.host}`).searchParams.get('token');
      const verificationResult = authenticateTokenWebSock(token);
      if (!verificationResult.valid) {
        console.log(`client not valid`);
        ws.close();
      return;
      }
      console.log('New client connected');
    });

    watchCollection((change) => {
      console.log(util.inspect(change, { depth: null })); 
      logger.info(util.inspect(change, { depth: null }));
      console.log(util.inspect(change, { depth: null }));
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(change));
        }
    });
      setLatestDocument(change);  // Update the stored document
    });

    

    server.listen(PORT, () => console.log(`example server listening on port ${PORT} ${rest.GREETING}`));
    
});
