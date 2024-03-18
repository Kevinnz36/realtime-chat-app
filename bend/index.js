const express = require ('express');
const app = express();
const htpp = require ('http');
const cors = require('cors');
const {Server} = require('socket.io');

app.use(cors());

const server = htpp.createServer(app);
const io = new Server(server,{
    cors:{
        origin:'http://localhost:5173',
        methods:['GET','POST']
    }
});

io.on('connection',(socket)=>{
    console.log(`Usuario actual: ${socket.id}`);

    socket.on('join_channel', (data)=>{
        socket.join(data);
        console.log(`Usuario: ${socket.id} se unió a la sala ${data}`);
    })

    socket.on('send_message', (data)=>{
        socket.to(data.channel).emit('receive_message',data)
    })

    socket.on('disconnect',()=>{
        console.log(`Usuario desconectado: ${socket.id}`);
    });
})

server.listen(3001, ()=>{
    console.log('server corriendo')
})