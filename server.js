import express, { static } from 'express';
const app = express(); 
const http = require('http').Server(app);
const io = require('socket.io')(http)

var videoPlayerData = new Object();
var currentHost = new String();

app.use(static('static'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/admin', (req, res) => {
  res.sendFile(__dirname + '/admin.html');
});


io.on('connection', (socket) => {

  console.log(`connect (${socket.id})`);
    socket.on('disconnect', () => {
        console.log(`disconnect (${socket.id})`);
    });

    // How it works:
    // Client sends a request to server to get the video data which sends a request to host, to get the video data
    // CLIENT ------> SERVER ------> HOST
    // CLIENT <------ SERVER <------ HOST
    
    socket.on('hostReturnVideoState', (data) => {
        if (socket.id !== currentHost) {
          return
        }
        //console.log(`hostReturnVideoState: (${socket.id})`)
        videoPlayerData = data
    })

    socket.on('serverGetVideoState', () => {
      io.emit('hostGetVideoState')
      io.emit('serverReturnVideoState', videoPlayerData)
      //console.log(`serverReturnVideoState (${socket.id})`)

    })

    // First user to connect to /admin is the host
    // TODO: This is a mediocre security placeholder -- think of something better
    socket.once('registerHost', () => {
      console.log(`registerHost: (${socket.id})`)
      currentHost = socket.id
    })
    


});

http.listen(80, '', () => {
  console.log('listening on *:80');
});