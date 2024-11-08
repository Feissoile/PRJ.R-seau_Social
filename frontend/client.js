const socket = io();

socket.on("connect", () => {
  console.log("Connected to server with ID:", socket.id);
});

socket.on("welcome", (message) => {
  console.log("Message from server:", message);
});
