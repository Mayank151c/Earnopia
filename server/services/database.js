const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://root:${process.env.DB_PASS}@cluster0.xlrl9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

let client, db;

const connectToEventDb = async () => {
    try {
        if(client && db) return db;
        client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        console.log('Successfully Connected to MongoDB');
        const eventDbName = 'eventDb';
        db = client.db(eventDbName);
  } catch (err) {
    console.error('MongoDB connection failed:', err);
    throw err;
  }
  return db;
};

module.exports = {
  connectToEventDb,
};
