const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017/newApp");
module.exports = mongoose;
