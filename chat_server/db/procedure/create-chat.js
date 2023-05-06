const createChat = (pool, from_id, friends_id) => {
  return new Promise((resolve, reject) =>
    pool.query("select create_chat(?) 'id_chat'", [[from_id, ...friends_id].join(":") + ":"], (err, result) => {
      pool.query(`
      select distinct
    id_chat as id,
    num_user,
    users,
    case when c.name is null and num_user <= 2 then 'private' else 'group' end as typeChat,
    c.name
from
    chat c
    join ( select fk_chat, count(*) as num_user, group_concat(fk_user separator ':') as users from chat_detail group by fk_chat) gc on gc.fk_chat = c.id_chat -- num users
    join chat_detail cd on cd.fk_chat = c.id_chat
    join user u on cd.fk_user = u.id_user
where 9 = 9
    and cd.fk_chat = ?
      `, [result[0].id_chat], (err, res) => {
        if (err) reject(err)
        resolve(res[0])
      })
    }))
}

module.exports = {createChat}
