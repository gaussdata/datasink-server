import sqlite3 from 'sqlite3'

const file = 'db/sqlite3.db'

export class Database {
  static connection: sqlite3.Database

  static async getConnection() {
    if (!this.connection) {
      this.connection = await new sqlite3.Database(file)
    }
    return this.connection
  }

  static async insert(sql: string, params: any[]) {
    const connection = await Database.getConnection()
    return new Promise((resolve, reject) => {
      connection.run(sql, params, (err: any, result: any) => {
        if (err) {
          reject(err)
        }
        else {
          resolve(result)
        }
      })
    })
  }

  static async query(sql: string): Promise<any[]> {
    const connection = await Database.getConnection()
    return new Promise((resolve, reject) => {
      connection.all(sql, (err, rows: any[]) => {
        if (err) {
          reject(err)
        }
        else {
          resolve(rows)
        }
      })
    })
  }
}
