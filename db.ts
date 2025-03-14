import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "../users/user.model";
import mysql from "mysql2/promise";

dotenv.config();
console.log(process.env);

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

export const db = new DataSource({
    type: "mysql",
    host: DB_HOST,
    port: Number(DB_PORT),
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    entities: [User],
    synchronize: true,
    logging: true,
});

async function initializeDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: DB_HOST,
            port: Number(DB_PORT),
            user: DB_USER,
            password: DB_PASSWORD,
        });

        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
        console.log(`✅ Database '${DB_NAME}' is ready.`);

        await db.initialize();
        console.log("TypeORM Data Source has been initialized!");
    } catch (error) {
        console.error("Database initialization failed:", error);
        process.exit(1);
    }
}

initializeDatabase();