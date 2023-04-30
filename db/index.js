const mysql = require("mysql");

pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'webchat',
  port: 8889
})

const findUserByEmail = async (email) => {

  await pool.query("select * from user where email = ?", [email], (err, result) => {
    if(err) throw err
    console.log("res", result)
    return result
  })
  /*await pool.getConnection(async (err, connection) => {
    if(err) throw err

    console.log("Connected to database")
    const result = connection.query("select * from user where email = ?", [email], (err, result) => {
      if(err) throw err
      console.log(result)
      return result
    })

    connection.release()
  })*/
}

findUserByEmail("simonmaggini@gmail.com")
  .then(res => console.log(res))

module.exports = pool
