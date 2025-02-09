const mongoose = require("mongoose");

module.exports.dbConnect = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, { useNewURLParser: true });
    console.log("database is connected");
  } catch (error) {
    console.log("error", error.messae);
  }
};
