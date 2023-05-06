const findUserByEmail = (pool, email) => {
  return new Promise((resolve, reject) => {
    pool.query("select * from user where email = ?", [email], (err, result) => {
      if (err) reject(err)
      resolve(result)
    })
  })
}

module.exports = {findUserByEmail}
