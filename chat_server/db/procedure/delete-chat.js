const deleteChat = (pool, from_id, chat_id) => {
  return new Promise((resolve, reject) =>
    pool.query("call delete_chat(?, ?)", [from_id, chat_id], (err, result) => {
      if (err) reject(err)
      else resolve(result)
    }))
}

module.exports = {deleteChat}
