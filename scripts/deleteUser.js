// Import mongoose
const mongoose = require("mongoose");

// Get MongoDB connection string from command-line argument
const uri = process.argv[3] || "mongodb+srv://codefolio777:R3xHoYBsS41yqpnz@cluster0.bg37sgh.mongodb.net/Codefolio?retryWrites=true&w=majority";

// Get user ID to delete from command-line argument
const userId = process.argv[2];

// Validate the provided arguments
if (!uri || !userId) {
  console.error("Please provide both the MongoDB connection string and user ID.");
  process.exit(1); // Exit if no uri or userId is provided
}

// Connect to MongoDB
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    
    deleteUserData();
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// Function to delete user data based on user_id or _id
async function deleteUserData() {
  try {
    // Convert userId to ObjectId (needed for _id)
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Fetch all collections from the MongoDB instance
    const collections = await mongoose.connection.db.listCollections().toArray();

    // Loop through each collection
    for (let collectionInfo of collections) {
      const collectionName = collectionInfo.name; // Get the collection name

      // Skip system collections (e.g., internal MongoDB collections)
      if (collectionName.startsWith("system.")) continue;

      const collection = mongoose.connection.collection(collectionName);

      // Find documents that match the userId or _id
      const documents = await collection
        .find({ $or: [{ userId: userObjectId }, { _id: userObjectId }] })
        .toArray(); // Convert the cursor to an array

      // Log the documents found
      
      

      // Deleting all documents where user_id or _id matches the user ID
      const result = await collection.deleteMany({
        $or: [{ userId: userObjectId }, { _id: userObjectId }],
      });

      
    }

    
  } catch (error) {
    console.error("Error deleting user data:", error);
  } finally {
    mongoose.connection.close(); // Close the connection after the operation is done
  }
}
