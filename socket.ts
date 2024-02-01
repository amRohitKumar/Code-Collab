import { io } from "socket.io-client";
import { SERVER_URL } from "@/backendUrl";

const socket = io(SERVER_URL, {
  closeOnBeforeunload: false,
  withCredentials: true,
  autoConnect: false,
});

export default socket;
