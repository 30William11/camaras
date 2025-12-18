// src/utils/logger.js
const LOG_ENABLED = import.meta.env.VITE_LOG_ENABLED === 'true'

export function logDebug(...args) {
  if (!LOG_ENABLED) return
  console.debug('[DEBUG]', ...args)
}

export function logInfo(...args) {
  if (!LOG_ENABLED) return
  console.info('[INFO]', ...args)
}

export function logError(...args) {
  if (!LOG_ENABLED) return
  console.error('[ERROR]', ...args)
}
