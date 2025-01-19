const { ObjectId } = require('mongodb');
const { connectToEventDb } = require('./database');

const getAll = async () => {
  try {
    const database = await connectToEventDb();
    const collection = database.collection('tasks');
    const events = await collection.find({}).toArray();
    return events;
  } catch (err) {
    console.error('Error fetching tasks:', err);
    throw err;
  }
};

const insert = async (data) => {
  try {
    const database = await connectToEventDb();
    const collection = database.collection('tasks');
    const result = await collection.insertOne(data);
    console.log(`Task inserted with _id: ${result.insertedId}`);
  } catch (err) {
    console.error('Error inserting event:', err);
  }
};

const update = async (_id, updatedData) => {
  try {
    const database = await connectToEventDb();
    const collection = database.collection('tasks');

    const result = await collection.updateOne(
      { _id:  new ObjectId(_id) },
      { $set: updatedData }
    );

    if (result.modifiedCount === 1) {
      console.log(`Task: ${_id} updated.`);
      return { success: true, message: `Task: ${_id} updated.` };
    } else {
      console.log(`No task found or no changes made for task with _id: ${_id}.`);
      return { success: false, message: `No task found or no changes made for task with _id: ${_id}.` };
    }
  } catch (err) {
    console.error('Error updating task:', err);
    throw new Error('Failed to update task');
  }
};

const remove = async (taskId) => {
  try {
    const database = await connectToEventDb();
    const collection = database.collection('tasks');
    const result = await collection.deleteOne({ _id: taskId });
    if (result.deletedCount === 1) {
      return {
        success: true,
        message: `Task: ${taskId} deleted.`
      };
    } else {
      return {
        success: false,
        message: `No task found: ${taskId}.`
      };
    }
  } catch (err) {
    console.error('Error deleting task:', err);
    return {
      success: false,
      message: `Error deleting task: ${err.message}`,
    };
  }
};

module.exports = {
  getAll,
  insert,
  update,
  remove,
};