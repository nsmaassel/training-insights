import { beforeAll, afterAll, afterEach } from '@playwright/test';
import { MongoClient } from 'mongodb';
import { generateTestFitFile } from '@training-insights/test-utils';
import path from 'path';

let mongoClient: MongoClient;

beforeAll(async () => {
  // Connect to MongoDB and verify connection
  try {
    mongoClient = new MongoClient(process.env.MONGODB_URL || 'mongodb://localhost:27017/test');
    await mongoClient.connect();
    await mongoClient.db('admin').command({ ping: 1 });
    console.log('MongoDB connection successful');

    // Generate test FIT file
    const testFilePath = path.join(__dirname, 'fixtures', 'test.fit');
    await generateTestFitFile(testFilePath);
    console.log('Test FIT file generated:', testFilePath);
  } catch (err) {
    console.error('Test setup failed:', err);
    throw err;
  }
});

afterAll(async () => {
  if (mongoClient) {
    await mongoClient.close();
  }
});

afterEach(async () => {
  // Clean test data
  if (mongoClient) {
    const db = mongoClient.db('test');
    await db.collection('activities').deleteMany({});
    await db.collection('files').deleteMany({});
  }
});