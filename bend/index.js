require('dotenv').config(); 

const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST']
}));

const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    console.log(`Usuario actual: ${socket.id}`);

    socket.on('join_channel', (data) => {
        socket.join(data);
        console.log(`Usuario: ${socket.id} se unió a la sala ${data}`);
    });

    socket.on('send_message', (data) => {
        socket.to(data.channel).emit('receive_message', data);
    });

    socket.on('disconnect', () => {
        console.log(`Usuario desconectado: ${socket.id}`);
    });
});

const port = process.env.PORT || 3001; 
server.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});
