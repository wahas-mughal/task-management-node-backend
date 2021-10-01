//initialize the router
const express = require("express");
const router = express.Router();
const Register = require("../models/register");
const bcrypt = require("bcrypt");
const multer = require("multer");

const { registerValidation } = require("../../schemavalidation");

const fileFilter = function (req, file, callback) {
  if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./uploads/");
  },
  filename: (req, file, callback) => {
    callback(
      null,
      // new Date().toISOString().replace(/:/g, "-") + file.originalname
      file.originalname
    );
  },
});

// upload an image
const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 1024 * 1024 * 10, //5 MBs
  },
  fileFilter: fileFilter,
});

// const upload = multer({ dest: "uploads/" });

//sign up route
router.post(
  "/api/auth/register",
  upload.single("profileImage"),
  (req, res, next) => {
    console.log(req.file);

    //validate req.body with registerValidation method
    let { error } = registerValidation(req.body);
    if (error) {
      return res.status(400).json({
        error: error,
      });
    }

    Register.findOne({ email: req.body.email })
      .exec()
      .then((emailExists) => {
        if (emailExists) {
          return res.status(409).json({
            message: "This email already exists.",
          });
        } else {
          //hash the password
          bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
            if (err) {
              return res.status(500).json({
                error: err,
              });
            }

            let register = new Register({
              firstname: req.body.firstname,
              lastname: req.body.lastname,
              email: req.body.email,
              password: hashedPassword,
              profileImage: req.file.path,
            });

            //save in database
            register
              .save()
              .then((result) => {
                console.log("Response -> ", result);
                res.status(201).json({
                  message: "You have successfully registered!",
                });
              })
              .catch((err) => {
                res.status(500).json({
                  error: err,
                });
              });
          });
        }
      })
      .catch((err) => {
        console.log("error is here");
        res.status(500).json({
          error: err,
        });
      });
  }
);

//login route
router.get("/api/auth/login", (req, res, next) => {
  res.status(200).json({
    message: "user login!",
  });
});

//forgot password route
router.get("/api/auth/forgotpassword", (req, res, next) => {
  res.status(200).json({
    message: "user forgot password!",
  });
});

module.exports = router;
