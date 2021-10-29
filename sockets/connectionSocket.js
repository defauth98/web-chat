const { consolidateDateAndTime } = require('../middlewares/dateAndTime');
const { addToUserArray } = require('../middlewares/users');
const { saveToDb } = require('../middlewares/dbWork');

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.emit('setNick', socket.id);
    
    socket.on('addUser', (usr) => {
      const usrPannel = addToUserArray(usr);
      io.emit('userPannel', usrPannel);
    });

    socket.on('message', (msg) => {
      const { chatMessage, nickname } = msg;
      const msgToSend = `${consolidateDateAndTime()} - ${nickname}: ${chatMessage}`;
      saveToDb(msgToSend);

      io.emit('message', msgToSend);
    });
  });
};
