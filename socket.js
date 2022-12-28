let readyPlayerCounter = 0;
//you can set up a custom namespace using the io.of function
//replace io with the namespace you specified
//you can can have multiple sockets for different functionality
//example, a namespace for tetris vs a namespace for pong

function listen(io) {
  //const pongNamespace=io.of('/pong')
  //pongNamespace.on("connection", (socket) => {
  io.on("connection", (socket) => {
    let room;
    console.log("a user connected", socket.id);

    socket.on("ready", () => {
      //to join a room you use the join function with the name of the room
      room = "room" + Math.floor(readyPlayerCounter / 2);
      socket.join(room);

      console.log("Player ready", socket.id);

      readyPlayerCounter++;

      if (readyPlayerCounter % 2 === 0) {
        //pongNamespace.emit('startGame',socket.id);
        // io.emit("startGame", socket.id);
        // we want to emit only to the users in the room, we use the "in" function
        io.in(room).emit("startGame", socket.id);
      }
    });

    socket.on("paddleMove", (paddleData) => {
      // socket.broadcast.emit("paddleMove", paddleData);
      //we want to broadcast only to the people in the room with the "to" function
      //replace broadcast with the .to(room)
      socket.to(game).emit("paddleMove", paddleData);
    });

    socket.on("ballMove", (ballData) => {
      // socket.broadcast.emit("ballMove", ballData);
      socket.to(room).emit("ballMove", ballData);
    });
    socket.on("disconnect", (reason) => {
      console.log(`Client ${socket.id} disconnected: ${reason}`);
      //to leave a room you use the leave function with the name of the room
      socket.leave(room);
    });
  });
}

module.exports = { listen };
