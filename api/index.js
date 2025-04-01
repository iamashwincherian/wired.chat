require("dotenv").config();
const apiServer = require("./api-server");
const wsServer = require("./ws-server");
const initDatabase = require("./config/init-db");

const API_PORT = process.env.API_PORT || 5005;
const WS_PORT = process.env.WS_PORT || 5003;

// Initialize database
initDatabase().then(() => {
  // Start API Server
  apiServer.listen(API_PORT, () => {
    console.log(`API Server is running on port ${API_PORT}`);
  });

  // Start WebSocket Server
  wsServer.listen(WS_PORT, () => {
    console.log(`WS Server is running on port ${WS_PORT}`);
  });
});
