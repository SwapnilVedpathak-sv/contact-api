const mongoose = require("mongoose");

const user = new mongoose.Schema(
  {
    phoneNumber: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("user", user);
