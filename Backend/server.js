const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');

const ConnectDB = require('./config/db');
const { chats } = require('./data/data');
const userRoutes = require('./Routes/userRoutes');
const chatRoutes = require('./Routes/chatRoutes');
const messageRoutes = require('./Routes/messageRoutes');
const { notFound, errorHandler } = require('./Middleware/errorMiddleware');
const path = require('path');

dotenv.config();
ConnectDB();
const app = express();

app.use(express.json()); //to accept Json data

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

const __dirname1 = path.resolve();
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname1, '/frontend/build')));
    app.get('*', (req, res) => {
        res.sendFile(
            path.resolve(__dirname1, 'frontend', 'build', 'index.html'),
        );
    });
} else {
    app.get('/', (req, res) => {
        res.send('API is running');
    });
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const Server = app.listen(
    PORT,
    console.log(`server started on PORT ${PORT}`.yellow.bold),
);

const io = require('socket.io')(Server, {
    pingTimeout: 60000,
    cors: {
        origin: 'http://localhost:3000',
    },
});

io.on('connection', (socket) => {
    console.log('Connected to socket.io');
    socket.on('setup', (userData) => {
        socket.join(userData._id);
        console.log(userData._id);
        socket.emit('connected');
    });
    socket.on('join chat', (room) => {
        socket.join(room);
        console.log('user Joined Room: ' + room);
    });
    socket.on('typing', (room) => socket.in(room).emit('typing'));
    socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));
    socket.on('new message', (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;
        if (!chat.users) return console.log('chat.users not defined');

        chat.users.forEach((user) => {
            if (user._id == newMessageRecieved.sender._id) return;

            socket.in(user._id).emit('message recieved', newMessageRecieved);
        });
    });

    socket.off('setup', () => {
        console.log('User Disconnected');
        socket.leave(userData._id);
    });
});
