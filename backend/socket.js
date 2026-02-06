const socketIo = require('socket.io');
const User = require('./model/users.model');
const captainModel = require('./model/captain.model');

let io;
module.exports.initializeSocket = (server) => {
io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);
    socket.on('join', async(data) => {
        const { userId, userType } = data;
        if(userType === 'user'){
            await User.findByIdAndUpdate(userId, {
                socketId: socket.id
            });
            
        } else if(userType === 'captain'){
            await captainModel.findByIdAndUpdate(userId, {
                socketId: socket.id
            });
        }
    }) 
    socket.on('update-location-captain', async(data) => {
    const { userId, userType, location } = data;
    if(!location || !location.ltd || !location.lng){
        return socket.emit('error', {
            message: 'invalid location data'
        })
    }
    const lng = Number(location.lng);
    const lat = Number(location.ltd);
    await captainModel.findByIdAndUpdate(userId, {
        location: {
            type: "Point",
            coordinates: [lng, lat] // ✅ correct GeoJSON order
        }
    });
})


    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});
}

module.exports.sendMessageToSocketId = (socketId, message) => {
    if(io){
        io.to(socketId).emit(message.event, message.data);
    }else{
        console.log('Socket.io not initialized.');
    }

}