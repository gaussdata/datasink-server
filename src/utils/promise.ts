import logger from '@/utils/logger.js'

export async function ignoreError<T>(promise: Promise<T>): Promise<T> {
  try {
    return await promise
  }
  catch (error) {
    logger.error('ignore error', error)
    return Promise.resolve() as Promise<T>
  }
}
