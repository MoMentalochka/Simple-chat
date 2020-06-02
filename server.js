const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const PORT = 8080

server.listen(PORT, ()=> console.log(`server is started on port ${PORT}`));
app.use(express.static(__dirname + '/'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html')
})

let connections = []
let users = []

io.on('connection', function (socket) {
  connections.push(socket)
  socket.on('disconnect', function () {
    if (socket.username) {
      users.splice(users.indexOf(socket.username), 1)
      socket.broadcast.emit('update users', users)
      socket.broadcast.emit('bye', socket.username)
    }
  })

  socket.on('chat message', function (data) {
    let from = socket.username
    let message = data
    io.emit('chat message', { message, from })
  })

  socket.on('new user', function (data) {
    users.push(data)
    socket.broadcast.emit('new user', data)
    socket.emit('update users', users)
    socket.broadcast.emit('update users', users)
    socket.username = data
  })
})