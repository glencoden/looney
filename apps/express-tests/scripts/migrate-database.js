"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const postgres_js_1 = require("drizzle-orm/postgres-js");
const migrator_1 = require("drizzle-orm/postgres-js/migrator");
const node_assert_1 = require("node:assert");
const postgres_1 = __importDefault(require("postgres"));
const connectionString = process.env.DATABASE_URL;
(0, node_assert_1.strict)(connectionString !== undefined, 'Database connection string is required');
const client = (0, postgres_1.default)(connectionString, { prepare: false, max: 1 });
const db = (0, postgres_js_1.drizzle)(client);
async function main() {
    await (0, migrator_1.migrate)(db, { migrationsFolder: 'migrations' });
    await client.end();
}
void main();
