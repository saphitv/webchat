const {decodeJwt} = require("../data/security.utils");
const retrieveUserIdFromRequest = (req, res, next) => {
  const jwt = req.cookies["SESSIONID"]

  if(jwt){
    handleSessionCookie(jwt, req)
      .then(() => next())
      .catch(err => {
        console.log(err)
        next()
      })
  } else {
    next()
  }
}

async function handleSessionCookie(jwt, req){
  try {

    const payload = await decodeJwt(jwt)

    req["user"] = payload
  } catch(err){console.log(err.message)}

}

module.exports = {retrieveUserIdFromRequest}
