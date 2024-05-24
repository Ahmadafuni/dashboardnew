// src/socket.js
import { io } from "socket.io-client";

// Replace with your server URL
const SOCKET_URL = "http://localhost:3002";

const socket = io(SOCKET_URL);

export default socket;
