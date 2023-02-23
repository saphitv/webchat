const argon2 = require("argon2");
const {createSessionToken} = require("../../data/security.utils");
const {db} = require("../../data/db");

async function attempLogin(credentials, user)  {
  // verifica che la password corrisponde
  const isPasswordValid = await argon2.verify(user.passwordDigest, credentials.password)

  if(!isPasswordValid){
    throw new Error("Password Invalid")
  }


  return createSessionToken(user)

}

async function loginAndBuildResponse(res, credentials, user){
  try {
    // controlla se la password è corretta e genera il jwt
    const sessionToken = await attempLogin(credentials, user)
    setSessionToken(res, sessionToken)

    res.status(200).json({id: user.id, email: user.email, roles: user.roles})

  } catch(err){res.sendStatus(403)}
}


async function createUserAndSession(res, credentials){
  try {
    // crea il digest della password
    const passwordDigest = await argon2.hash(credentials.password)

    // salva l'utente nel db
    const user = db.createUser(credentials.email, passwordDigest)



    console.log(db.getUsers())

    // crea il jwt
    const sessionToken = await createSessionToken(user)

    setSessionToken(res, sessionToken)

    res.status(200).json({id: user.id, email: user.email})
  } catch (err){
    console.log("email già registrata", err)
    res.sendStatus(403)
  }


}

function setSessionToken (res, sessionToken){
  res.cookie("SESSIONID", sessionToken, { httpOnly: true , secure: true, sameSite: "strict"})
}

module.exports = {createUserAndSession, loginAndBuildResponse, setSessionToken}
