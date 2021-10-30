/**
 * @type {import('socket.io-client').Socket}
 */
const socket = window.io();

const form = document.querySelector('.form');
const input = document.querySelector('.input');
const messages = document.querySelector('.messages');
const DATATESTID = 'data-testid';

// https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

let nickname = makeid(16);

socket.emit('listUser', nickname);

function changeNickName() {
  const changeName = document.querySelector('.userForm');
  changeName.addEventListener('submit', (e) => {
    e.preventDefault();
    const nickNameInput = document.querySelector('.nickNameInput');
    nickNameInput.setAttribute(DATATESTID, 'online-user');
    sessionStorage.setItem('nickName', nickNameInput.value);
    nickname = nickNameInput.value;
    nickNameInput.value = '';
  });
}

const createUserLi = (user) => {
  const listUser = document.querySelector('.usersList');
  const li = document.createElement('li');
  li.textContent = user;
  li.setAttribute(DATATESTID, 'online-user');
  listUser.append(li);
};

socket.on('usersOnline', (users) => {
  users.forEach((user) => createUserLi(user));
});

socket.on('listUser', createUserLi);

changeNickName();

form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const msg = {
    chatMessage: input.value,
    nickname,
  };

  if (input.value) {
    socket.emit('message', msg);
    input.value = '';
  }
});

socket.on('dbMessages', (msgs) => {
  msgs.forEach(({ data: { message, nickname: nick, timestamp } }) => {
    const li = document.createElement('li');
    li.textContent = `${timestamp} ${nick} ${message}`;
    li.setAttribute(DATATESTID, 'message');
    messages.append(li);
  });
  window.scrollTo(0, document.body.scrollHeight);
});

socket.on('disconnectUser', (userDisconnected) => { 
  console.log(userDisconnected);
  const userList = document.querySelector('.usersList').children;
  const userLoggedOut = [...userList].find((user) => {
    console.log(user.textContent);
    return user.textContent === userDisconnected;
  });
userLoggedOut.remove();
});

socket.on('message', (msg) => {
const li = document.createElement('li');
li.textContent = msg;
li.setAttribute(DATATESTID, 'message');
messages.append(li);
window.scrollTo(0, document.body.scrollHeight);
});

window.addEventListener('unload', () => {
  socket.emit('disconnectUser', nickname);
});