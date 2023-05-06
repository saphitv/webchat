const getNotFriends = (pool, user_id) => {
  return new Promise((resolve, reject) => {
    pool.query(`
    with
     tChats as (
        select
            *
        from
            chat_detail
        where
            fk_user = 1
    ),

    tFriends as (
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
    )

select
    u.username,
    u.email,
    u.id_user 'id'
from
    user u
    left join tFriends f on u.id_user = f.id
where 9 = 9
    and f.id is null

    `, [user_id], (err, result) => {
      if (err) reject(err)
      resolve(result)
    })
  })
}

module.exports = {getNotFriends}
