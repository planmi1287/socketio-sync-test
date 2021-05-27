var socket = io();
var videoPlayer = document.getElementById('player')
var hostPlayer = new Object()
var maxHostToClientDiff = 3


function syncVideo() {
    let hostToClientDiff = Math.abs(hostPlayer.currentTime - videoPlayer.currentTime)
    console.log(hostToClientDiff);
    if (hostToClientDiff > maxHostToClientDiff) {
        videoPlayer.currentTime = hostPlayer.currentTime
        console.log('y')
    } 
    //videoPlayer.paused = hostPlayer.paused
}



socket.on('serverReturnVideoState', (data) => {
    hostPlayer = data
})


setInterval(() => {socket.emit('serverGetVideoState'); syncVideo()}, 100);