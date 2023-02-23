const util = require('util')
const crypto = require('node:crypto')
const fs = require("fs");
const jwt = require("jsonwebtoken")

const randomBytes = util.promisify(crypto.randomBytes)
const signJwt = util.promisify(jwt.sign)

const PRIVATE_KEY = fs.readFileSync('cert/key.pem')
const PUBLIC_KEY = fs.readFileSync('cert/certificate.pem')
const SESSION_DURATION = 60 * 30

const createSessionToken = async user => {
  return signJwt({
    roles: user.roles
  }, PRIVATE_KEY, {
    algorithm: 'RS512',
    expiresIn: SESSION_DURATION,
    subject: user.id.toString()
  })
}

const decodeJwt = token => {
  return jwt.verify(token, PUBLIC_KEY)
}

const createCsrfToken = async () => {
  return randomBytes(32).then(bytes => bytes.toString("hex"))
}


module.exports = {randomBytes, PRIVATE_KEY, PUBLIC_KEY, createSessionToken, decodeJwt, createCsrfToken}
