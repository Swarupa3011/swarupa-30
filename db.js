const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root', // Replace with your MySQL username
    password: 'password', // Replace with your MySQL password
    database: 'jobApplicationDB',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Export the pool for use in other files
module.exports = pool.promise(); // Use promise() for async/await support