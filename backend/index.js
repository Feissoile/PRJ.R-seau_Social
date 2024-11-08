import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url'; 

const app = express();
const server = createServer(app);
const io = new Server(server);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);
    socket.emit('Bienvenue', 'Bienvenue sur le serveur Socket.io !');

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
    
});



server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});