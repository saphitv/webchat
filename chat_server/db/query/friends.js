const getFriends = (pool, user_id) => {
  return new Promise((resolve, reject) => {
    pool.query(`
    with
    tChats as (
        select
            *
        from
            chat_detail
        where
            fk_user = ?
    )

select
    u.username,
    u.email,
    u.id_user 'id'
from
    chat_detail cd
    join tChats c on  c.fk_chat = cd.fk_chat -- solo le chat in cui sono dentro
    left join user u on cd.fk_user = u.id_user
group by
    id_user, username, email
    `, [user_id], (err, result) => {
      if (err) reject(err)
      resolve(result)
    })
  })
}

module.exports = getFriends
