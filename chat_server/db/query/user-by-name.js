const getUserByName = (pool, username) => {
  return new Promise((resolve, reject) => {
    pool.query(`select id_user 'id', email, username from user where username = ?`, [username], (err, result) => {
      if (err) reject(err)
      resolve(result)
    })
  })
}

module.exports = {getUserByName}
