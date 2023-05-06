const getMessages = (pool, chat_id) => {
  return new Promise((resolve, reject) => pool.query(`
    select
      m.id_message 'id',
      type,
      content 'cnt',
      fk_from 'from',
      fk_chat 'chat_id',
      createdAt
    from
      message m
    where
    fk_chat = ?`,
    [chat_id], (err, result) => {
      if (err) reject(err)
      resolve(result)
    }))
}


module.exports = {getMessages}
