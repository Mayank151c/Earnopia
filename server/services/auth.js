const { connectToEventDb } = require('./database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const SECRET_KEY = "secret_key";

const getUser = async (id) => {
  try {
    const database = await connectToEventDb();
    const collection = database.collection('users');
    const user = await collection.findOne({ _id: new ObjectId(id) });
    return user;
  } catch (err) {
    console.error("Error fetching user by ID:", err);
    throw err;
  }
};

//updateUser
const updateUser = async (id, updatedData) => {
  try {
    const database = await connectToEventDb();
    const collection = database.collection('users');
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedData }
    );
    if (result.modifiedCount === 1) {
      console.log(`User: ${id} updated.`);
      return { success: true, message: `User: ${id} updated.` };
    } else {
      console.log(`No user found or no changes made for user with _id: ${id}.`);
      return { success: false, message: `No user found or no changes made for user with _id: ${id}.` };
    }
  } catch (err) {
    console.error("Error updating user:", err);
    throw err;
  }
};

const signUp = async (userData) => {
  try {
    const database = await connectToEventDb();
    const collection = database.collection('users');

    const existingUser = await collection.findOne({ username: userData.username });
    if (existingUser) {
      throw new Error("Username already exists");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = { ...userData, password: hashedPassword, amount: 0 };
    const result = await collection.insertOne(newUser);
    console.log(`User registered with _id: ${result.insertedId}`);
    return { success: true, message: "User registered successfully" };
  } catch (err) {
    console.error("Error signing up user:", err);
    throw err;
  }
};

const signIn = async (userData) => {
  try {
    const database = await connectToEventDb();
    const collection = database.collection('users');

    const user = await collection.findOne({ username: userData.username });
    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(userData.password, user.password);
    if (!isPasswordValid) {
      throw new Error(`Invalid password`);
    }

    const token = jwt.sign({ id: user._id, username: user.username }, SECRET_KEY, { expiresIn: "1h" });
    return { message: "Login successful", token };
  } catch (err) {
    console.error("Error signing in user:", err);
    throw err;
  }
};

const validateToken = async (token) => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded;
  } catch (err) {
    console.error("Error validating token:", err);
    throw err;
  }
};

module.exports = {
  getUser,
  updateUser,
  signUp,
  signIn,
  validateToken,
};
