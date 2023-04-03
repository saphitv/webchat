
function onDisconnect(users, socket, message) {
  console.log("------------------")
  console.log("users", users)
  console.log("user disconnected", socket.user.username)
  const index = users.findIndex((user) => user.id === socket.user.id);
  if (index > -1) {
    users.splice(index, 1);
  }
  this.broadcast.emit("user disconnected", socket.user);

  console.log("users", users)
  console.log("------------------")
}

module.exports = { onDisconnect };

