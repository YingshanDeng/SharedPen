var express = require('express')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var path = require('path')

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/index.html'))
})

app.use(express.static('build'))
app.use(express.static('node_modules'))

http.listen(3000, function () {
  console.log('listening on *:3000')
})

var EditorSocketIOServer = require('../build/SharedPenServer.js')
var server = new EditorSocketIOServer('', [], 1)

io.on('connection', function (socket) {
  server.addClient(socket)
})
