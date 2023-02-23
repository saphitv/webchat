const express = require('express');
const router = express.Router();
const validatePassword = require("../../data/password-validation");
const {db} = require("../../data/db");
const {createUserAndSession, loginAndBuildResponse} = require("./auth.utils");

/* GET home page. */
router.post('/register', function (req, res) {
  const credentials = req.body;

  const passwordErrors = validatePassword(credentials.password)

  if (passwordErrors.length > 0) {
    res.status(400).json({passwordErrors})
    return
  }

  createUserAndSession(res, credentials)
    .catch(err => {
      console.log("create user and session: ", err)
      res.sendStatus(500)
    })
});

router.post('/login', function (req, res) {
  const credentials = req.body;


  const user = db.findUserByEmail(credentials.email)


  if (!user) {
    res.sendStatus(403)
  } else {

    loginAndBuildResponse(res, credentials, user)
      .catch(err => {
        console.log("error: login and build response", err)
      })
  }
});

router.post('/logout', function (req, res) {
  res.clearCookie("SESSIONID")
  res.clearCookie("XSRF-TOKEN")

  res.status(200).json({message: 'Logout Successful'});
});


module.exports = router;
