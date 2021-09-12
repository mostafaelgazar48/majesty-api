const socketIo = require('socket.io');

class SocketService {
   constructor(server) {
     this.io = socketIo(server);
     this.io.on('connection', socket => {
       console.log('user connected')
   });
 } 

  emiter(event, body) {
    if(body)
      this.io.emit(event, body);
  }
}

module.exports = SocketService;
