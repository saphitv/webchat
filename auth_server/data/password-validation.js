const PasswordValidator = require("password-validator");

const schema = new PasswordValidator()

schema
  .is().min(6)
  .is().uppercase()
  .is().lowercase()
  .is().digits()
  .is().not().spaces()

module.exports = function validatePassword(password){
  return schema.validate(password, {list: true})
}
