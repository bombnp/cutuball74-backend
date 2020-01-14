const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  socketPath: process.env.DB_SOCKET
};

const secret = process.env.SERVER_SECRET;

module.exports = {dbConfig, secret}
