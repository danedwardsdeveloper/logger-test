/* eslint-disable no-console */
import chalk from 'chalk'

import { LogLevel, logLevels } from '@/types/definitions/logLevel'

import { currentLogLevel, isProduction } from './environment/publicVariables'

const shouldLog = (messageLevel: LogLevel) => logLevels[messageLevel] <= logLevels[currentLogLevel]

const safeStringify = (data: unknown): string => {
  if (typeof data === 'string') return data
  try {
    return JSON.stringify(data, null, 2)
  } catch {
    return '[Unserializable data]'
  }
}

const stringifyArgs = (...args: unknown[]): string[] =>
  args.map(arg => chalk(typeof arg === 'string' ? arg : safeStringify(arg)))

export const logger = {
  debug:
    isProduction || !shouldLog('level3debug')
      ? () => {}
      : (...args: unknown[]): void => console.debug(chalk.magenta('[DEBUG]', ...stringifyArgs(...args))),
  info:
    isProduction || !shouldLog('level2info')
      ? () => {}
      : (...args: unknown[]): void => console.info(chalk.blue('[INFO]', ...stringifyArgs(...args))),
  warn:
    isProduction || !shouldLog('level1warn')
      ? () => {}
      : (...args: unknown[]): void => console.warn(chalk.yellow('[WARN]', ...stringifyArgs(...args))),
  error: !shouldLog('level0error')
    ? () => {}
    : (...args: unknown[]): void => console.error(chalk.red('[ERROR]', ...stringifyArgs(...args))),
}
