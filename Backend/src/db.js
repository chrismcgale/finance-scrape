const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://chrisMcG:4cGy5npbmWBWBAxN@cluster0.bk9osym.mongodb.net/?retryWrites=true&w=majority";

const query = async () => {
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const collection = client.db("fin-scrape").collection("constituents");

    return collection;
  }  catch (err) {
    console.log(err);
  }
};


module.exports = {
  query,
};
