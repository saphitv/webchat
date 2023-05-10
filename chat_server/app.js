const debug = require('debug')('auth_server:auth_server');
const {createServer} = require('https');
const {PRIVATE_KEY, PUBLIC_KEY} = require("../auth_server/data/security.utils");
const {Server} = require('socket.io')
const sessionTokenMiddleware = require("./handler/auth");
const express = require("express")
const {retrieveUserIdFromRequest} = require("./middleware/getUser.middleware");
const cookieParser = require('cookie-parser');
const {getNotFriends} = require("./db/query/notFriend");
const {createChat} = require("./db/procedure/create-chat");
const getAllFriends = require("./db/query/all-user");
const getChats = require("./db/query/chats");
const {getMessages} = require("./db/query/messages");
const {getLastMessages} = require("./db/query/last-chat-message");
const getFriends = require("./db/query/friends");
const {sendMessage} = require("./db/procedure/send-message");
const mysql = require("mysql");
const connectToChatsHandler = require("./handler/connectToChats");
const privateMessageHandler = require("./handler/privateMessage");

const options = {
  key: PRIVATE_KEY, cert: PUBLIC_KEY
};

const app = express()


app.use(cookieParser())
app.use(express.json())
app.use(retrieveUserIdFromRequest)

const pool = mysql.createPool({
  host: 'localhost', user: 'saphitv', password: 'saphitv', database: 'webchat', port: 3306
})

app.post("/chats", (req, res) => {
  const id_user = req['user'].sub

  if (id_user)
    getChats(pool, id_user)
      .then(result => {
        res.json(result)
      })
  else
    res.sendStatus(401)
})

app.post('/message', (req, res) => {
  const id_user = req['user'].sub
  const chat_id = req.body.chatId

  if(id_user && chat_id) {
    getMessages(pool, chat_id)
      .then(result => {
        res.json(result)
      })
  } else
    res.sendStatus(400)
})

app.post('/message/last', (req, res) => {
  const chats = req.body.chats
  // TODO: check if user is in chats

  if(chats.length > 0) {
    getLastMessages(pool, chats)
      .then(result => {
        res.json(result)
      })
  } else
    res.status(400).json([])
})

app.post("/friends", (req, res) => {
  const id_user = req['user'].sub

  if (id_user)
    getFriends(pool, id_user)
      .then(result => {
        res.json(result)
      })
  else
    res.sendStatus(401)
})

app.post("/not/friends", (req, res) => {
  const id_user = req['user'].sub

  if (id_user)
    getNotFriends(pool, id_user)
      .then(result => {
        res.json(result)
      })
  else
    res.sendStatus(401)
})


app.post("/friends/all", (req, res) => {
  const id_user = req['user'].sub
  getAllFriends(pool, id_user)
    .then(result => {
      res.json(result)
    })
})

app.post("/chat/create", (req, res) => {
  const id_user = req['user'].sub
  const id_friends = req.body.users

  if (id_user && id_friends) {
    createChat(pool, id_user, id_friends)
      .then(result => {
        res.json(result)
      })
  } else
    res.sendStatus(400)
})

app.post("/chat/send", (req, res) => {
  const message = req.body
  sendMessage(pool, message.from.id, message.chat_id, message.type, message.cnt)
  res.status(200).send({success: 'OK'})
})


/* ------------------------------------------------------------------------------------------
SOCKET.IO
------------------------------------------------------------------------------------------ */
const port = normalizePort(process.env.PORT || '3001');
const server = createServer(options, app);

const io = new Server(server, {cors: {origin: ["https://localhost:4200", 'm152.beta22550.com']}})

io.use(sessionTokenMiddleware);

io.on("connection", (socket) => {
  //console.log("user connected", socket.user.username)

  if(!socket.user) {
    console.log("user not authenticated")
    socket.disconnect()
    return
  }

  console.log("user connected", socket.user.username)

  // join the chats
  connectToChatsHandler(io, socket)

  // private message
  privateMessageHandler(io, socket)
});

io.on("close", (socket) => {
  console.log("closed")
})




server.on('error', onError);
server.on('listening', onListening);
server.listen(port);


/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  let port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP auth_server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  let bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP auth_server "listening" event.
 */

function onListening() {
  let addr = server.address();
  let bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
