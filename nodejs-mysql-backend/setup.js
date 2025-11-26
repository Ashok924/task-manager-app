import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

async function setupDatabase() {
  const dbName = process.env.DB_NAME || "task_manager";
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "admin",
    password: process.env.DB_PASSWORD || "admin",
  });

  try {
    console.log("Creating database...");
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    console.log("✓ Database created");

    await connection.end();

    const dbConnection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "admin",
      password: process.env.DB_PASSWORD || "admin",
      database: dbName,
    });

    console.log("✓ Database selected");

    console.log("Creating users table...");
    await dbConnection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log("✓ Users table created");

    console.log("Creating tasks table...");
    await dbConnection.execute(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log("✓ Tasks table created");

    console.log("\n✓ Database setup completed successfully!");
    dbConnection.end();
  } catch (error) {
    console.error("✗ Error during setup:", error.message);
    process.exit(1);
  }
}

setupDatabase();
