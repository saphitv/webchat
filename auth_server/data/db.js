let LessonsData = require('./LessonsData')
let UsersData = require('./UsersData')

class InMemoryDb {
  userCounter = UsersData.length + 1

  getLessons() {
    return LessonsData
  }

  createUser(email, passwordDigest){
    const id = this.userCounter++;

    if(UsersData.find(user => user.email == email)){
      throw Error("Email already registered")
    }

    const user = {
      id,
      email,
      passwordDigest
    }

    UsersData.push(user)

    return user
  }

  getUsers(){
    return UsersData
  }

  findUserByEmail(email) {
    return UsersData.find(user => user.email === email)
  }

  findUserById(id) {
    return UsersData.find(user => user.id == id);
  }
}



const db = new InMemoryDb()


module.exports = {db}

