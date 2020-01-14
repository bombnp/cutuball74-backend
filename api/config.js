const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  socketPath: `/cloudsql/${process.env.CLOUD_SQL_CONNECTION_NAME}`
};

module.exports = {dbConfig}
