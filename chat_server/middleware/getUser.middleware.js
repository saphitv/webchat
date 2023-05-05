const jwt = require("jsonwebtoken");
const {PUBLIC_KEY} = require("../../auth_server/data/security.utils");
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

const decodeJwt = token => {
  return jwt.verify(token, PUBLIC_KEY)
}

module.exports = {retrieveUserIdFromRequest}
