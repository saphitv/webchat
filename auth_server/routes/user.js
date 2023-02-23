let express = require('express');
const {db} = require("../data/db");
let router = express.Router()


router.get('/', (req, res) => {
  if(req["user"]){
    const user = db.findUserById(req["user"]["sub"])

    if(user){
      res.status(200).json({id: user.id, email: user.email, roles: user.roles})
    } else {
      res.sendStatus(204)
    }
  } else {
    res.sendStatus(204)
  }


})

module.exports = router

