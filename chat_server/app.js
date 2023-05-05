const debug = require('debug')('auth_server:auth_server');
const { createServer } = require('https');
const { PRIVATE_KEY, PUBLIC_KEY } = require("../auth_server/data/security.utils");
const { Server } = require('socket.io')
const sessionTokenMiddleware = require("./auth");
const { onDisconnect } = require("./defaultEvent");
const { partial } = require("lodash");
const express = require("express")
const {chatOpened, sendMessage, getChats, getFriends, getLastMessages, getMessages} = require("../db");
const {retrieveUserIdFromRequest} = require("./middleware/getUser.middleware");
const cookieParser = require('cookie-parser');

const options = {
  key: PRIVATE_KEY, cert: PUBLIC_KEY
};

const app = express()


app.use(cookieParser())
app.use(express.json())
app.use(retrieveUserIdFromRequest)

app.post("/chats", (req, res) => {
  const id_user = req['user'].sub

  if(id_user)
    getChats(id_user)
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
    getMessages(chat_id)
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
    getLastMessages(chats)
      .then(result => {
        res.json(result)
      })
  } else
    res.json([]).send(400)
})

app.post("/friends", (req, res) => {
  const id_user = req['user'].sub

  if(id_user)
    getFriends(id_user)
      .then(result => {
        res.json(result)
      })
  else
    res.sendStatus(401)
})

app.post("/chat/open", (req, res) => {

})

app.post("/chat/send", (req, res) => {
  const message = req.body
  sendMessage(message.from.id, message.chat_id, message.type, message.cnt)
  res.status(200).send({success: 'OK'})
})

const port = normalizePort(process.env.PORT || '3001');
const server = createServer(options, app);

const io = new Server(server, {cors: {origin: "https://localhost:4200"}})

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
  socket.on("connect to chats", ({chats}) => {
    console.log("connect to chats", chats)
    socket.join(chats)
  })

  // private message
  socket.on("private message", ({mes}) => {
    console.log(socket.rooms)
    console.log(mes.from.username + " -> " + mes.chat_id + ": " + mes.cnt)
    socket.to(mes.chat_id).emit("private message", {
      ...mes
    })
  })

  // socket.on("disconnect", partial(onDisconnect, users, socket))



  /* const users = [];
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      socketId: id,
      id: socket.user.id,
      username: socket.user.username,
    });
  }*/

  // console.log("new user emit", users)
  //socket.emit("users_init", users);




  /* socket.broadcast.emit("user connected",{
    socketId: socket.id,
    id: socket.user.id,
    username: socket.user.username,
  })*/

  /* socket.on("private message", ({mes}) => {
    //console.log("private message", mes)
     console.log(mes.from.username, " -> " , mes.to.username, ": ", mes.cnt)
    socket.to(mes.to.socketId).emit("private message", {
      ...mes
    })
  })*/


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
  var port = parseInt(val, 10);

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

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

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
  var addr = server.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
