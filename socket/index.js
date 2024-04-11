const socketIO = require("socket.io");
const http = require("http");
const express = require("express");
const cors = require("cors");
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

require("dotenv").config({
  // Load environment variables
  path: "./.env",
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello world from socket server!"); // Send a response to the client
});

let users = [];

const addUser = (userId, socketId) => {
  // Add a user to the users array
  !users.some((user) => user.userId === userId) && // Check if the user is already in the array
    users.push({ userId, socketId }); // Add the user to the array
};

const removeUser = (socketId) => {
  // Remove a user from the users array
  users = users.filter((user) => user.socketId !== socketId); // Filter out the user with the given socketId
};

const getUser = (receiverId) => {
  // Get a user from the users array
  return users.find((user) => user.userId === receiverId); // Find the user with the given userId
};

// Define a message object with a seen property
const createMessage = ({ senderId, receiverId, text, images }) => ({
  // Create a message object
  senderId,
  receiverId,
  text,
  images,
  seen: false,
});

io.on("connection", (socket) => {
  // Listen for a connection event
  // when connect
  console.log(`a user is connected`);

  // take userId and socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  // send and get message
  const messages = {}; // Object to track messages sent to each user

  socket.on("sendMessage", ({ senderId, receiverId, text, images }) => {
    const message = createMessage({ senderId, receiverId, text, images });

    const user = getUser(receiverId);

    // Store the messages in the `messages` object
    if (!messages[receiverId]) {
      messages[receiverId] = [message];
    } else {
      messages[receiverId].push(message);
    }

    // send the message to the recevier
    io.to(user?.socketId).emit("getMessage", message);
  });

  socket.on("messageSeen", ({ senderId, receiverId, messageId }) => {
    const user = getUser(senderId);

    // update the seen flag for the message
    if (messages[senderId]) {
      const message = messages[senderId].find(
        (message) =>
          message.receiverId === receiverId && message.id === messageId
      );
      if (message) {
        message.seen = true;

        // send a message seen event to the sender
        io.to(user?.socketId).emit("messageSeen", {
          senderId,
          receiverId,
          messageId,
        });
      }
    }
  });

  // update and get last message
  socket.on("updateLastMessage", ({ lastMessage, lastMessagesId }) => {
    io.emit("getLastMessage", {
      lastMessage,
      lastMessagesId,
    });
  });

  //when disconnect
  socket.on("disconnect", () => {
    console.log(`a user disconnected!`);
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

server.listen(process.env.PORT || 4000, () => {
  console.log(`server is running on port ${process.env.PORT || 4000}`);
});
