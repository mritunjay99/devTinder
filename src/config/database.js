const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://namasteNode_db:TDBgfcaYcvl4Xc5X@namastenode.8r4sf.mongodb.net/devTinder"
  );
};

module.exports = {
  connectDb,
};
