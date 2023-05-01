const mysql = require("mysql");

pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'webchat',
  port: 8889
})

// create a function that query the database and return the result
const findUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    pool.query("select * from user where email = ?", [email], (err, result) => {
      if(err) reject(err)
      resolve(result)
    })
  })
}


findUserByEmail("simonmaggini@gmail.com")
  .then((result) => {
    console.log("result", result)
  })

module.exports = pool
