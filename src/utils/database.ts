import BetterSqlite3 from 'better-sqlite3'

const file = 'db/sqlite3.db'

export class Database {
  static connection: BetterSqlite3.Database

  static async getConnection() {
    if (!this.connection) {
      this.connection = new BetterSqlite3(file)
    }
    return this.connection
  }

  static async insert(sql: string, params: any[]) {
    const connection = await Database.getConnection()
    const stmt = connection.prepare(sql)
    const result = stmt.run(params)
    return result
  }

  static async query(sql: string): Promise<any[]> {
    const connection = await Database.getConnection()
    const stmt = connection.prepare(sql)
    const rows = stmt.all()
    return rows
  }

  static async exec(sql: string) {
    const connection = await Database.getConnection()
    connection.exec(sql)
    return true
  }
}
