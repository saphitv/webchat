function privateMessageHandler(io, socket) {
  socket.on("private message", ({mes}) => {
    console.log(socket.rooms)
    console.log(mes.from.username + " -> " + mes.chat_id + ": " + mes.cnt)
    socket.to(mes.chat_id).emit("private message", {
      ...mes
    })
  })
}

module.exports = privateMessageHandler
