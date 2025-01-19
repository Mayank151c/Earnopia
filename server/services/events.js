const { connectToEventDb } = require('./database');

const getAll = async () => {
  try {
    const database = await connectToEventDb();
    const collection = database.collection('events');
    const events = await collection.find({}).toArray();
    return events;
  } catch (err) {
    console.error('Error fetching events:', err);
    throw err;
  }
};

const insert = async (data) => {
  try {
    const database = await connectToEventDb();
    const collection = database.collection('events');
    const result = await collection.insertOne(data);
    console.log(`Event inserted with _id: ${result.insertedId}`);
  } catch (err) {
    console.error('Error inserting event:', err);
  }
};

const remove = async (eventId) => {
  try {
    const database = await connectToEventDb();
    const collection = database.collection('events');
    const result = await collection.deleteOne({ _id: eventId });
    if (result.deletedCount === 1) {
      return {
        success: true,
        message: `Event with _id: ${eventId} deleted successfully.`
      };
    } else {
      return {
        success: false,
        message: `No event found with _id: ${eventId}.`
      };
    }
  } catch (err) {
    console.error('Error deleting event:', err);
    return {
      success: false,
      message: 'An error occurred while deleting the event.'
    };
  }
};

module.exports = {
  getAll,
  insert,
  remove
};