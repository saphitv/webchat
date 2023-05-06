const sendMessage = (pool, from_user_id, chat_id, type, content) => {
  pool.query("call send_message(?, ?, ?, ?)", [from_user_id, chat_id, type, content])
}

module.exports = {sendMessage}
