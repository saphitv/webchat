const debug = require('debug')('auth_server:auth_server');
const https = require('https');
const {PRIVATE_KEY, PUBLIC_KEY} = require("../auth_server/data/security.utils");
const {Server} = require('socket.io')
const sessionTokenMiddleware = require("./auth");

var options = {
  key: PRIVATE_KEY, cert: PUBLIC_KEY
};

var port = normalizePort(process.env.PORT || '3001');

var server = https.createServer(options);

/**
 * Listen on provided port, on all network interfaces.
 */


const io = new Server(server, {cors: {origin: "https://localhost:4200"}})

io.use(sessionTokenMiddleware);

io.on("connection", (socket) => {
  //console.log("user connected", socket.user.username)

  const users = [];
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      socketId: id,
      userId: socket.user.id,
      username: socket.user.username,
    });
  }

  // console.log("new user emit", users)
  socket.emit("users", users);

  socket.broadcast.emit("user connected",{
    socketId: socket.id,
    userId: socket.user.id,
    username: socket.user.username
  })

  socket.on("private message", (mes) => {
    socket.to(mes.toSocket).emit("private message", {
      ...mes
    })
  })
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
