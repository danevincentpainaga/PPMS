const io = require('socket.io')(8000);
var Redis = require('ioredis');
var redis = new Redis();
const client =  Redis.createClient();

io.on('connection', (socket) => {
    // io.emit('message', 'This is from server...');
    const redisClient = Redis.createClient();

    redisClient.subscribe('test-channel');

    console.log("Redis server running.....");

    redisClient.on("message", function(channel, message) {
        console.log(message);
        // client.emit(channel, message);
        io.emit('messageSend', message);
    });

    client.on('disconnect', function() {
        redisClient.quit();
    });
});