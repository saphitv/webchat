function checkIfAuthenticated(req, res, next){
  if(req['user']){
    next()
  } else {
    res.sendStatus(403)
  }

}

module.exports = {checkIfAuthenticated}
