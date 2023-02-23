let express = require('express');
const {db} = require("../../data/db");
const {createSessionToken} = require("../../data/security.utils");
const {setSessionToken} = require("../auth/auth.utils");
let router = express.Router()


router.post('/impersonate', (req, res) => {
  const impersonatedUserEmail = req.body.email;

  const impersonatedUser = db.findUserByEmail(impersonatedUserEmail);

  createSessionToken(impersonatedUser)
    .then(sessionToken => {


      setSessionToken(res, sessionToken)

      res.status(200).json({
        id: impersonatedUser.id,
        email: impersonatedUser.email,
        roles: impersonatedUser.roles
      });


    })
    .catch(err => {
      console.log("Error trying to login as user",err);
      res.sendStatus(500);
    });
})

module.exports = router
