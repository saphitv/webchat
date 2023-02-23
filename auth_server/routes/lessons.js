let {db} = require('../data/db')
var express = require('express');
const {checkIfAuthenticated} = require("../middleware/auth.middleware");
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res) {
  res.status(200).json({lessons: db.getLessons()});
});

module.exports = router;
