const socket_io = require("socket.io");
const io = socket_io();

let socketApi = {};

socketApi.io = io;

io.on("connection", function (socket) {
  let numberOfUser = socket.client.conn.server.clientsCount;
  let mess = `${numberOfUser} are seeing this`;
  console.log(mess);
  io.emit("receive", mess);
});

module.exports = socketApi;
