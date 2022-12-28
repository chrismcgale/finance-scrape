/** Import Dotenv module */
require('dotenv').config();

const uri = "mongodb+srv://chrisMcG:4cGy5npbmWBWBAxN@cluster0.bk9osym.mongodb.net/?retryWrites=true&w=majority";

/** Import Mongoose module */
const mongoose = require('mongoose');

/** URI for connection */
const uri = process.env.APP_ENV === 'devlocal'
  ? `mongodb://${
    process.env.MONGOHOST
  }:${
    process.env.MONGOPORT
  }/${
    process.env.MONGODB}`
  : `mongodb://${
    process.env.MONGOUSER
  }:${
    process.env.MONGOPASSWORD
  }@${
    process.env.MONGOHOST
  }:${
    process.env.MONGOPORT
  }/${
    process.env.MONGODB
  }?${process.env.APP_ENV === 'production'
    ? 'ssl=true'
    : 'authSource=admin&replicaSet=replset&ssl=true'}`;

/**
 * Connects to MongoDB using Mongoose
 * @return {string}
 */
function connect() {
  return mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });
}

/**
 * Checks if a successful connection was established to the DB
 */
function checkConnection() {
  const { connection } = mongoose;
  connection.once('open', () => {
    logger.info('MongoDB database connection established successfully!');
  });
}

/**
 * Disconnects from the DB
 * @return {string}
 * */
function disconnect() {
  return mongoose.disconnect();
}

module.exports = {
  mongoose, connect, checkConnection, disconnect,
};
