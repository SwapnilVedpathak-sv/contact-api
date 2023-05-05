const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const authModel = require("../models/authModel");

router.post("/login", [body("email").not().isEmpty(), body("password").not().isEmpty(), body("propertyCode").not().isEmpty()], async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0],
    });
  }

  const emailExist = await authModel.findOne({ email: req.body.email, propertyCode: req.body.propertyCode });

  if (emailExist) {
    bcrypt.compare(req.body.password, emailExist.password, (error, result) => {
      if (error) return res.status(401).json(error);
      if (result == true) {
        let token = jwt.sign({ email: emailExist.email }, "secret", {
          expiresIn: "90d",
        });
        emailExist.save().then(() => {
          return res.status(200).json({ status: 200, email: emailExist.email, propertyCode: emailExist.propertyCode, token })
        }).catch((error) => {
          return res.status(404).json({ error, message: "Something went wrong" })
        });
      } else if (result == false) {
        res.status(401).json({ error: "Wrong password" });
      }
    });
  } else {
    res.status(401).json({ error: "Please Enter valid credentials & property code!!" });
  }
});

router.post("/register", [body("email").isEmail(), body("email").not().isEmpty(), body("password").not().isEmpty()],
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        error: errors.array()[0],
      });
    }

    if (req.body.password.length < 8) {
      return res.status(401).json({
        error: "Password cannot be smaller than 8 characters",
      });
    }

    const emailExist = await authModel.findOne({ email: req.body.email, propertyCode: req.body.propertyCode });

    if (emailExist) return res.status(401).json({ error: "Admin with the E-mail already exists" });

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const userDetails = {
      email: req.body.email,
      password: hashedPassword,
      propertyCode: req.body.propertyCode
    };

    const newUser = new authModel(userDetails);
    newUser.save().then((result) => {
      return res.status(200).json({ msg: "Admin Registered Successfully!!!", details: result });
    })
      .catch((error) => {
        return res.status(401).json({ error: "Something Went Wrong!!!" });
      });
  }
);

module.exports = router;