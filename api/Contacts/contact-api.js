const express = require("express");
const router = express.Router();
const contactsModel = require("../models/contactModel");

// Get All Contacts
router.get("/allContacts", async (req, res) => {
  const getAllContacts = await contactsModel.find();
  if (getAllContacts) {
    return res.status(200).json(getAllContacts);
  } else {
    return res.status(401).json({ error: "Something Went Wrong!!!" });
  }
});

// Get Specific Contact
router.get("/contact/:id", async (req, res) => {
  const getContactDetails = await contactsModel.findOne({ _id: req.params.id });
  if (getContactDetails) {
    return res.status(200).json(getContactDetails);
  } else {
    return res.status(401).json({ error: "Something Went Wrong!!!" });
  }
});

router.delete("/removeContact/:id", async (req, res) => {
  const removeContactInfo = await contactsModel.findByIdAndDelete(
    req.params.id
  );
  if (removeContactInfo) {
    return res
      .status(200)
      .json({ msg: "Conatct has been deleted successfully!!" });
  } else {
    return res.status(401).json({ error: "Something Went Wrong!!" });
  }
});

// Update Contact
router.put("/updateContact", async (req, res) => {
  const payload = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phoneNumber: req.body.phoneNumber,
    profileImg: req.body.profileImg,
  };

  const updateContactInfo = await contactsModel.findOneAndUpdate(
    req.body._id,
    payload,
    { new: true }
  );
  updateContactInfo
    .save()
    .then((ele) => {
      return res
        .status(200)
        .json({ msg: "Conatct has been updated successfully!!", details: ele });
    })
    .catch((error) => {
      return res.status(401).json({ error: "Something Went Wrong!!" });
    });
});

// Add Contact
router.post("/addContact", async (req, res) => {
  const phoneNumberExist = await contactsModel.findOne({
    phoneNumber: req.body.phoneNumber,
  });

  if (phoneNumberExist) {
    return res.status(401).json({ error: "Phone Number is already exists." });
  }

  const newPhoneNumber = new contactsModel(req.body);
  newPhoneNumber
    .save()
    .then((result) => {
      return res
        .status(200)
        .json({ msg: "Contact Added successfully!!", details: result });
    })
    .catch((error) => {
      return res.status(401).json({ error: "Something Went Wrong!!!" });
    });
});

module.exports = router;
