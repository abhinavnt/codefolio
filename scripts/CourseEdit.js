
const mongoose = require("mongoose");

// Replace with your MongoDB Atlas connection string
const MONGO_URI = "mongodb+srv://codefolio777:R3xHoYBsS41yqpnz@cluster0.bg37sgh.mongodb.net/Codefolio?retryWrites=true&w=majority";

// Collection name for the Course model
const COLLECTION_NAME = "courses"; // MongoDB collection name (typically lowercase plural of model name)

async function clearEnrolledStudents() {
  try {
    // Connect to MongoDB Atlas
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB Atlas");

    // Verify if the collection exists
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionExists = collections.some(c => c.name === COLLECTION_NAME);

    if (!collectionExists) {
      console.log(`Collection "${COLLECTION_NAME}" does not exist`);
      return;
    }

    // Update all documents to set enrolledStudents to an empty array
    const result = await mongoose.connection.db.collection(COLLECTION_NAME).updateMany(
      {},
      { $set: { enrolledStudents: [] } }
    );

    console.log(`Updated ${result.modifiedCount} documents in "${COLLECTION_NAME}" collection. All enrolledStudents arrays are now empty.`);

  } catch (error) {
    console.error("Error clearing enrolledStudents:", error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  }
}

// Run the script
clearEnrolledStudents();