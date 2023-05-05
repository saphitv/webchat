const mysql = require("mysql");

// .gitignore line 5: db credentials
pool = mysql.createPool({
  host: 'localhost', user: 'saphitv', password: 'saphitv', database: 'webchat', port: 3306
})

// create a function that query the database and return the result
const findUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    pool.query("select * from user where email = ?", [email], (err, result) => {
      if (err) reject(err)
      resolve(result)
    })
  })
}

const createNormalChat = (with_user_id, from_user_id) => {
  pool.query("call create_normal_chat(?, ?)", [with_user_id, from_user_id], (err, result) => {
    if (err) reject(err)
    resolve(result)
  })
}

const getFriends = (user_id) => {
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

const getChats = (user_id) => {
  return new Promise((resolve, reject) => {
    pool.query(`
      select
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
    and cd.fk_user = ?
    `, [user_id], (err, result) => {
      if (err) reject(err)
      resolve(result)
    })
  })
}

const sendMessage = (from_user_id, chat_id, type, content) => {
  pool.query("call send_message(?, ?, ?, ?)", [from_user_id, chat_id, type, content])
}

const getMessages = (chat_id) => {
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

const getLastMessages = (chat_list) => {
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

module.exports = {getChats, findUserByEmail, createNormalChat, sendMessage, getFriends, getMessages, getLastMessages}
