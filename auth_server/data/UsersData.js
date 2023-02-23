const UsersData = [
  {
    id: 1,
    email: 'admin@angular-university.io',
    passwordDigest: '$argon2id$v=19$m=65536,t=3,p=4$wOTRUdkaOlseqYNPHXnR1Q$X2YyZQbEamnQ7LABkKr9ZKLpHQRUlVbwEEZkTOBY/Do',
    roles: ["USER", "ADMIN"]
  },

  {
    id: 2,
    email: 'test@angular-university.io',
    passwordDigest: '$argon2id$v=19$m=65536,t=3,p=4$BQpjx6eKpe4j1435yKAUGg$1FrEkyshiojJlPsAk2AsDaXuOklvxraqCXwfnwO2E9E',
    roles: ["USER"]
  },]

module.exports = UsersData
