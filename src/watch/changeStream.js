const {ParkingLots} = require('../models/parkingLots');


const Model = ParkingLots;

function watchCollection(callback) {
  const changeStream = Model.watch();
  changeStream.on('change', (change) => {
    callback(change);
  });
}

module.exports = {
  watchCollection,
};
