const getAllFriends = (pool, id_user) => {
  return new Promise((resolve, reject) => {
    pool.query(`select username, email, id_user 'id' from user where id_user <> ?`, [id_user], (err, result) => {
      if (err) reject(err)
      resolve(result)
    })
  })
}

module.exports = getAllFriends
