import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    console.log('Nouvelle connexion établie');
    socket.emit('message', 'Bienvenue sur le serveur Socket.io !');
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});