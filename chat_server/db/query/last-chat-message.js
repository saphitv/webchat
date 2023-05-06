const getLastMessages = (pool, chat_list) => {
  return new Promise((resolve, reject) => {
    pool.query(`
    with
      t1 as (
        select
          m.id_message, type, content, fk_from 'from_id', fk_chat 'chat_id', createdAt,
          rank() over (partition by m.fk_chat order by m.createdAt desc) as ranking
        from
          message m
      )

      select id_message 'id', type, content 'cnt', from_id 'from', chat_id, createdAt
      from t1 where ranking = 1
      and chat_id in (${chat_list.join(",")})
    `, (err, result) => {
      if (err) reject(err)
      resolve(result)
    })
  })
}

module.exports = {getLastMessages}
