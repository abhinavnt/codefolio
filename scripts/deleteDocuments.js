const mongoose = require("mongoose");

// Replace with your MongoDB Atlas connection string
const MONGO_URI = "mongodb+srv://codefolio777:R3xHoYBsS41yqpnz@cluster0.bg37sgh.mongodb.net/Codefolio?retryWrites=true&w=majority";

// Specify the collection name you want to clear
const COLLECTION_NAME = process.argv[2]

async function clearCollection(collectionName) {
  try {
    // Connect to MongoDB Atlas
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB Atlas");

    // Verify if the collection exists
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionExists = collections.some(c => c.name === collectionName);

    if (!collectionExists) {
      console.log(`Collection "${collectionName}" does not exist`);
      return;
    }

    // Delete all documents in the specified collection
    await mongoose.connection.db.collection(collectionName).deleteMany({});
    console.log(`All documents in collection "${collectionName}" have been removed`);

  } catch (error) {
    console.error("Error clearing collection:", error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  }
}

// Run the script
clearCollection(COLLECTION_NAME);