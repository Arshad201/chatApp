const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const path = require('path');
const cors = require('cors');

app.use(cors());

const dotenv = require('dotenv');
const connectToDb = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
dotenv.config();
connectToDb();

app.use(express.static(path.join(__dirname, '../', 'frontend', 'build')));

app.get('/', (req, res)=>{

    res.sendFile(path.join(`${__dirname}`, '../', 'frontend', 'build'));

});


app.use(express.json());

//Routes
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

app.use(notFound);
app.use(errorHandler);


const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, ()=>{
    console.log(`Server is listening on the port - ${PORT}`);
})

const io = require('socket.io')(server,{
    pingTimeout: 60000,
});

io.on('connection', (socket)=>{
    console.log('connected to socket.io !')

    socket.on('setup', (userData)=>{
        socket.join(userData._id);
        console.log(userData._id);
        socket.emit('connected')
    });

    socket.on('join chat', (room)=>{
        socket.join(room);
        console.log(`Join room : ${room}`);

    });

    socket.on("new message", (newMessageRecieved)=>{
        var chat = newMessageRecieved.chat;

        if(!chat.users) return console.log('chat.users not defined!');

        chat.users.forEach((user)=>{
            if(user._id == newMessageRecieved.sender._id) return;

            socket.in(user._id).emit('message received', newMessageRecieved);
        })
    });

    socket.on("typing", ({selectedChat, user})=>{
        
        selectedChat.users.forEach((u)=>{

            if(u._id == user._id) return;

            var msg = `${user.name} is typing`

            socket.in(u._id).emit('typing recieved', msg);

        })
        
    })

    socket.off('setup', ()=>{
        console.log("User disconnected!");
        socket.leave(userData._id);
    });

})
