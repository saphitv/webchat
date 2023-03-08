const UsersData = [
  {
    id: 1,
    email: 'simonmaggini@gmail.com',
    passwordDigest: '$argon2id$v=19$m=65536,t=3,p=4$VTftzy9W7JbIp2h/CIlmag$wpKMKTKYFTifF/Tt4Tq9PU27ouVQRaET3RreHOxkC88',
    roles: ["USER", "ADMIN"],
    username: "saphitv"
  },
  {
    id: 2,
    email: 'simonmaggini@gmail.com1',
    passwordDigest: '$argon2id$v=19$m=65536,t=3,p=4$cHlQyjpX6zifxg/eH/LbNg$NazFdkNHIAnD37tRidfmwcxLVA15PsZPoiMmTLV0dog',
    roles: [ 'USER' ],
    username: "simon"
  },
  {
    id: 3,
    email: 'simonmaggini@gmail.com2',
    passwordDigest: '$argon2id$v=19$m=65536,t=3,p=4$fXfb7cd19k7am82PzOxvHQ$9zOPEg5Tp7OwX/yh3oeFkAzLcKbXB3il40q9cLF45kM',
    roles: [ 'USER' ],
    username: "simon2"
  }

]

module.exports = UsersData
