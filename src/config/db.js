const { mongoose } = require("mongoose");

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB connected successfully");
  } catch (error) {
    throw new Error("DB connection failed");
  }
};

module.exports = { dbConnect };
