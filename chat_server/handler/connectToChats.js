function connectToChatsHandler(io, socket) {
  socket.on("connect to chats", ({chats}) => {
    console.log("connect to chats", chats)
    socket.join(chats)
  })
}

module.exports = connectToChatsHandler
