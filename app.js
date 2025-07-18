const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/user.routes");
const orderRoutes = require("./routes/order.routes");
const messageRoutes = require("./routes/message.routes");
const reviewRoutes = require("./routes/review.routes");
const notificationRoutes = require("./routes/notification.routes");
const authRoutes = require('./routes/auth.routes');
const http = require('http');
const socketIo = require('socket.io');
const db = require('./db');


const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5180'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/uploads', express.static('uploads')); // это дл я аватара

io.on('connection', (socket) => {
  console.log('Пользователь подключился');

  socket.on('joinOrder', (orderId) => {
    socket.join(`order_${orderId}`);
  });

  socket.on('sendMessage', async (msg) => {
    // msg: { order_id, sender_id, text }
    try {
      const result = await db.query(
        'INSERT INTO messages (order_id, sender_id, text) VALUES ($1, $2, $3) RETURNING *',
        [msg.order_id, msg.sender_id, msg.text]
      );
      const savedMsg = result.rows[0];
      io.to(`order_${msg.order_id}`).emit('newMessage', savedMsg);
    } catch (error) {
      console.error('Ошибка при сохранении сообщения через сокет:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Пользователь отключился');
  });
});

server.listen(5000, () => console.log('Server with socket.io started'));

module.exports = server;

