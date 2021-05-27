const express =  require('express')
const app = express(); 
const http = require('http').Server(app);
const io = require('socket.io')(http)

var data = {
  paused: true,
  currentTime: 0,
  currentSource: undefined,
}

app.use(express.static('static'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/admin', (req, res) => {
  res.sendFile(__dirname + '/admin.html');
});


io.on('connection', (socket) => {

    console.log('CLIENT CONNECTED (' + socket.id + ')');
    socket.on('disconnect', () => {
        console.log('A user disconnected');
        
    });

    socket.on('play video', () => {
      console.log('PLAY MEDIA')
      io.emit('play video');
    });

    socket.on('pause video', () => {
      console.log('PAUSE MEDIA')
      io.emit('pause video');
    });


    socket.on('sync video', () => {
      console.log('SYNC TO A CLIENT (' + socket.id + ')')
      console.log(data.currentTime)
      socket.emit('set state', data.currentTime, data.currentSource, data.paused)
    });


    socket.on('return data', (time, src, paused) => {
      data.currentTime = time
      data.currentSource = src
      data.paused = paused
      
      console.log(`CURRENT VIDEO STATE: ${data.currentTime} ${data.currentSource} ${data.paused}`)
    });


});

http.listen(80, '', () => {
  console.log('listening on *:80');
});