var socket = io();
var videoPlayer = document.getElementById('player');

socket.emit('registerHost', socket.id)


socket.on('hostGetVideoState', () => {
    console.log('hostGetVideoData')
    socket.emit('hostReturnVideoState', {currentTime: videoPlayer.currentTime, currentSource: videoPlayer.src, paused: videoPlayer.paused})
})