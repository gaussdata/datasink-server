import { addColumnToTable } from '@/migrations/core.sql.js'
import { Database } from '@/utils/database.js'
import logger from '@/utils/logger.js'

export class MigrationService {
  constructor() {
  }

  async init() {
    try {
      await Database.exec(addColumnToTable('events', 'host', 'TEXT'))
    }
    catch (error) {
      logger.error('add columns to events error', error)
    }
    const query = `select rowid, * from events where host is null`
    const events = await Database.query(query) || []
    const data = events.map(event => ({
      ...event,
      host: new URL(event.url || '').host || '',
    }))
    logger.info(`update events total ${events.length}`)
    logger.info(`update events data ${data.length}`)
    for (const event of data) {
      const query = `update events set host='${event.host}' where rowid=${event.rowid}`
      try {
        await Database.exec(query)
      }
      catch (error) {
        logger.error(`update events ${event.rowid} error`, error)
      }
    }
    logger.info('update events success')
  }
}
