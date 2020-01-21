const dbConfig = {
  "TCP": {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT
  },
  "UNIX": {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    socketPath: process.env.DB_SOCKET
  }
};

const secret = process.env.SERVER_SECRET;

module.exports = {dbConfig, secret}
