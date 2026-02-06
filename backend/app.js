const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const CORS = require("cors");
const http = require("http");
const connectDB = require("./db/db");
const userRouter = require('./routes/Auth.route');
const cookieParser = require("cookie-parser");
const captainRouter = require("./routes/Captain.route");
const mapsRouter = require("./routes/Maps.routes");
const rideRouter = require("./routes/Ride.route");
const { Server } = require("socket.io");
const sockets = require("./socket");
app = express();
const server = http.createServer(app);
sockets.initializeSocket(server);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  CORS({
    origin: true, // frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // allow cookies/authorization headers
  })
);

app.get("/", (req, res) => {
    res.send("Hello BHARAT");        
})
app.use('/users', userRouter);
app.use('/captain', captainRouter);
app.use('/maps', mapsRouter);
app.use('/ride', rideRouter);
const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
})

module.exports = server;