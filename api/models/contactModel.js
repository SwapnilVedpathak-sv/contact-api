const mongoose = require("mongoose");

const contact = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    profileImg: {
      type: String,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("contact", contact);
