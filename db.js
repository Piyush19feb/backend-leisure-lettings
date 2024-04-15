const mysql = require("mysql2");

// lets create connection pool
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "manager",
  port: 3306,
  database: "leisure_lettings",
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

// export the connection pool
module.exports = { pool };
