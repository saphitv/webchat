let LessonsData = require('./LessonsData')
let UsersData = require('./UsersData')
const mysql = require("mysql");

class DB {
  pool = mysql.createPool({
    host: 'localhost', user: 'saphitv', password: 'saphitv', database: 'webchat', port: 3306
  })

  createUser(username, email, passwordDigest) {
    return new Promise((resolve, reject) => this.pool.query(`call create_user(?, ?, ?)`, [username, email, passwordDigest], (err, result) => {
      this.pool.query(`select id_user 'id', username, email, password 'passwordDigest' from user where username = ? and email = ?`, [username, email], (err, result) => {
        if (err) reject(err)
        resolve(result[0])
      })
    }))
  }

  findUserByEmail(email) {
    return new Promise((resolve, reject) => this.pool.query(`select id_user 'id', username, email, password 'passwordDigest' from user where email = ?`, [email], (err, result) => {
      if (err) reject(err)
      resolve(result[0])
    }))
  }

  findUserById(id) {
    return new Promise((resolve, reject) => this.pool.query(`select id_user 'id', username, email, password 'passwordDigest' from user where id_user = ?`, [id], (err, result) => {
      if (err) reject(err)
      resolve(result[0])
    }))
  }
}

const db = new DB()


module.exports = {db}

