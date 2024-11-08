// client.js

// Initialiser la connexion avec le serveur de sockets
const socket = io();

// Vérifier si la connexion est réussie
socket.on("connect", () => {
    console.log("Connected to server with ID:", socket.id);
});

// Écouter d’autres événements venant du serveur
socket.on("welcome", (message) => {
    console.log("Message from server:", message);
});

// Ajouter d'autres événements selon les fonctionnalités souhaitées
