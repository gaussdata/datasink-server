
import sqlite3 from "sqlite3";
const file = "db/sqlite3.db";

export class Database {

  static connection = null;

  static async getConnection() {
    if (!this.connection) {
      this.connection = await new sqlite3.Database(file);
    }
    return this.connection;
  }
}
