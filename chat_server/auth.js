const jwt = require("jsonwebtoken");
const {PUBLIC_KEY} = require("../auth_server/data/security.utils");

const decodeJwt = token => {
  return jwt.verify(token, PUBLIC_KEY)
}

async function handleSessionCookie(jwt){
    return decodeJwt(jwt);
}

const retrieveUserIdFromRequest = (jwt, socket, next) => {
    handleSessionCookie(jwt)
      .then((payload) => {
        //console.log("jwt handshake", payload)
        //socket.handshake.auth.username = jwt.sub.username
        socket.user = {}
        socket.user.username = payload.username
        socket.user.id = payload.sub

        next()
      })
      .catch(err => {
        console.log(err.message)
        next()
      })

}

module.exports = (socket, next) => {
  const jwt = socket.request.headers.cookie.match("(^| )SESSIONID([^;]+)")[0].replace("SESSIONID=", "")

  if(jwt)
    retrieveUserIdFromRequest(jwt, socket, next)
  else {
    socket.close()
    next(new Error("JWT non esistente o scaduto", { }))
  }


}
