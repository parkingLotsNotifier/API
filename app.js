const express = require("express");
const util = require("util");
const bodyParser = require("body-parser");
const {
  PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOST,
  ...rest
} = require("./config/env");
const database = require("./config/database");
const router = require("./src/routers/publisher");
const register = require("./src/routers/register");
const { watchCollection } = require("./src/watch/changeStream");
const cors = require("cors");
const { createLogger } = require("./src/logger/logger");
const { setLatestDocument } = require("./src/controller/DocumentStorage");
const {
  authenticateTokenHTTP,
} = require("./src/autentication/autenticationHTTP");
const logger = createLogger("app");
const http = require("http");
const WebSocket = require("ws");
const {
  authenticateTokenWebSock,
} = require("./src/autentication/authenticateWebSock");

database.connect(DB_USERNAME, DB_PASSWORD, DB_HOST).then(() => {
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());

  app.use("/auth", register);

  app.use(authenticateTokenHTTP);

  app.use("/", router);

  const server = http.createServer(app);
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws, request) => {
    const token = new URL(
      request.url,
      `http://${request.headers.host}`
    ).searchParams.get("token");
    const verificationResult = authenticateTokenWebSock(token);
    if (!verificationResult.valid) {
      console.log(`client not valid`);
      ws.close();
      return;
    }
    console.log("New client connected");
  });

  // Define the logReadable function
  function logReadable(change) {
    if (change.fullDocument && Array.isArray(change.fullDocument.slots)) {
      const formattedSlots = change.fullDocument.slots.map((slot) => ({
        Lot_Name: slot.lot_name ?? "Undifind",
        Cropped_Photo_Id_Num: parseInt(
          slot.filename?.match(/_(\d+)\.jpg/ || [])[1] ?? NaN,
          10
        ),
        Prediction_Class: slot.prediction?.class ?? "Undifind",
        Confidence: parseFloat(slot.prediction?.confidence ?? NaN).toFixed(2),
        Coords: [slot.coordinate?.x1 ?? NaN, slot.coordinate?.y1 ?? NaN],
        Width_Height: [slot.coordinate?.w ?? NaN, slot.coordinate?.h ?? NaN],
      }));

      // Sort the data by 'Lot_Name' and 'Cropped_Photo_Id_Num'
      formattedSlots.sort((a, b) => {
        if (a.Lot_Name[0] === "A" && b.Lot_Name[0] === "B") return -1;
        if (a.Lot_Name[0] === "B" && b.Lot_Name[0] === "A") return 1;
        if (a.Lot_Name < b.Lot_Name) return -1;
        if (a.Lot_Name > b.Lot_Name) return 1;
        if (a.Lot_Name === b.Lot_Name) {
          return a.Cropped_Photo_Id_Num - b.Cropped_Photo_Id_Num;
        }
      });

      // Manually move 'B10' to the end of the array
      const b10Index = formattedSlots.findIndex(
        (slot) => slot.Lot_Name === "B10"
      );
      if (b10Index !== -1) {
        const b10 = formattedSlots.splice(b10Index, 1);
        formattedSlots.push(b10[0]);
      }

      const formattedData = formattedSlots.reduce((acc, slot) => {
        // Group the data by lot_name
        if (!acc[slot.lot_name]) {
          acc[slot.lot_name] = [];
        }
        acc[slot.lot_name].push(slot);
        return acc;
      }, {});

      for (const lotName in formattedData) {
        console.table(formattedData[lotName], [
          "Lot_Name",
          "Cropped_Photo_Id_Num",
          "Prediction_Class",
          "Confidence",
          "Coords",
          "Width_Height",
        ]);
      }
    }
  }

  watchCollection((change) => {
    logReadable(change);
    logger.info(util.inspect(change, { depth: null }));
    //console.log(util.inspect(change, { depth: null })); PRINTS TWICE FOR NO REASON
    console.log(
      "⬜⬛⬜⬛⬜⬛⬜⬛⬜⬛⬜⬛⬜⬛⬜⬛⬜⬛⬜⬛⬜⬛⬜⬛⬜⬛⬜⬛⬜⬛⬜⬛⬜⬛⬜⬛⬜⬛⬜⬛⬜⬛⬜⬛⬜⬛⬜⬛⬜⬛⬜⬛⬜⬛"
    );
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(change));
      }
    });
    setLatestDocument(change); // Update the stored document
  });

  server.listen(PORT, () =>
    console.log(`example server listening on port ${PORT} ${rest.GREETING}`)
  );
});
