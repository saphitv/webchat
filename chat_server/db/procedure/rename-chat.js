const renameChat = (pool, from_id, chat_id, new_name) => {
  return new Promise((resolve, reject) =>
    pool.query("call rename_chat(?, ?, ?)", [from_id, chat_id, new_name], (err, result) => {
      if (err) reject(err)
      else resolve(result)
    }))
}

module.exports = {renameChat}
