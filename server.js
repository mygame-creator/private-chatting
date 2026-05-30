const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: { origin: "*" } // Allows your HTML page to connect globally
});

const users = {};

app.get('/', (req, res) => res.send('Chat server is running.'));

io.on('connection', (socket) => {
    socket.on('join', (username) => {
        users[username] = socket.id;
    });

    socket.on('private_message', ({ to, message, from }) => {
        const targetSocketId = users[to];
        if (targetSocketId) {
            io.to(targetSocketId).emit('receive_message', { from, message });
        }
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Server on port ${PORT}`));