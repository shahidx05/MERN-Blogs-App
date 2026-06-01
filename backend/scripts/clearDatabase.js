const mongoose = require('mongoose');
const path = require('path');

require('dotenv').config({
  path: path.resolve(__dirname, '../.env')
});

async function clearDatabase() {
  try {
    console.log('MONGO_URI:', process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI);

    console.log('Connected to MongoDB');

    await mongoose.connection.db.dropDatabase();

    console.log('✅ Database cleared successfully');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    process.exit(1);
  }
}

clearDatabase();