var express = require('express')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
// var cors = require('cors')
// var path = require('path')

http.listen(4000, function () {
  console.log('listening on *:4000')
})

var EditorSocketIOServer = require('../build/SharedPenServer.js')
var server = new EditorSocketIOServer('', [], 1)

io.on('connection', function (socket) {
  server.addClient(socket)
})
