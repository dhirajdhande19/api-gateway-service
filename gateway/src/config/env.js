import dotenv from "dotenv";
dotenv.config();

// Redirect Service url's
export const ORDERS_BASE_URL = process.env.ORDERS_BASE_URL;
export const USERS_BASE_URL = process.env.USERS_BASE_URL;

// JWT
export const JWT_SECRET = process.env.JWT_SECRET;
