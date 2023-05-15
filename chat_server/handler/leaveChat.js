function leaveChatHandler(io, socket) {
  socket.on("leave chat", ({chatId}) => {
    socket.leave(chatId)
  })
}

module.exports = leaveChatHandler
