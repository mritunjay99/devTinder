const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(
    process.env.Db_Connection
  );
};

module.exports = {
  connectDb,
};
