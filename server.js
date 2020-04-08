const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

let connections = []
let users = []
server.listen(8080);
app.use(express.static(__dirname + '/'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html')
})

io.on('connection', function (socket) {
  connections.push(socket)

  socket.on('disconnect', function () {
    if (socket.username) {
      console.log('disconnected');
      users.splice(users.indexOf(socket.username), 1)
      socket.broadcast.emit('update users', users)
      socket.broadcast.emit('bye', socket.username)
    }
  })

  socket.on('chat message', function (data) {
    console.log('Новое сообщение от' + socket.username + " " + data);
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
    console.log(socket.username + ' входит в чат');
  })
})