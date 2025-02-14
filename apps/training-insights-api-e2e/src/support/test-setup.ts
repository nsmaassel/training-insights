/* eslint-disable */
import axios from 'axios';
import { MongoClient } from 'mongodb';

// Connection string from environment or default test database
const mongoUrl = process.env.MONGODB_URL ?? 'mongodb://localhost:27017/test';

let mongoClient: MongoClient;

module.exports = async function () {
  // Configure axios for tests
  const host = process.env.HOST ?? 'localhost';
  const port = process.env.PORT ?? '3000';
  axios.defaults.baseURL = `http://${host}:${port}`;

  // Connect to real test database
  mongoClient = new MongoClient(mongoUrl);
  await mongoClient.connect();

  // Make database connection available globally for tests
  global.__MONGO_CLIENT__ = mongoClient;
};

// Clean up resources
module.exports.teardown = async () => {
  if (mongoClient) {
    await mongoClient.close();
  }
};
