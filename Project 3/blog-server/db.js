const MongoClient = require("mongodb").MongoClient;

let client = null;
module.exports.connect = function (url, callback) {
  if (client) {
    callback();
  }

  client = new MongoClient(url, { useUnifiedTopology: true });
  client.connect(function (err) {
    if (err) {
      client = null;
      callback(err);
    } else {
      callback();
    }
  });
};

module.exports.get = function (dbName) {
  return client.db(dbName);
};

module.exports.close = function () {
  if (client) {
    client.close();
    client = null;
  }
};
