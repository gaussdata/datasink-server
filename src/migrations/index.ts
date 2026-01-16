import { addColumnToTable } from '@/migrations/core.sql.js'
import { Database } from '@/utils/database.js'
import logger from '@/utils/logger.js'

export class MigrationService {
  constructor() {
  }

  async init() {
    try {
      await this.addColumns('events', 'host', 'TEXT')
    }
    catch (error) {
      logger.error('add columns to events error', error)
    }
    const query = `select * from events where host is null`
    const events = await Database.query(query) || []
    const data = events.map(event => ({
      ...event,
      host: new URL(event.url || '').hostname || '',
    }))
    logger.info(`update events total ${events.length}`)
    logger.info(`update events data ${data.length}`)
    for (const event of data) {
      const query = `update events set host = '${event.host}' where event_id = '${event.event_id}'`
      try {
        await Database.exec(query)
      }
      catch (error) {
        logger.error(`update events ${event.event_id} error`, error)
      }
    }
    logger.info('update events success')
  }

  async addColumns(table: string, column: string, dataType: string) {
    const query = addColumnToTable(table, column, dataType)
    logger.info('add columns to events', column)
    try {
      await Database.exec(query)
      logger.info('add columns to events success')
    }
    catch (error) {
      logger.error('add columns to events error', error)
    }
  }
}
