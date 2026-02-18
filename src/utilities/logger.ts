const isProd = import.meta.env?.PROD === true;

function noop(..._args: unknown[]) {
  // no-op in production for debug/log
}

const logger = {
  debug: isProd ? noop : (...args: unknown[]) => console.debug(...args),
  log: isProd ? noop : (...args: unknown[]) => console.log(...args),
  info: isProd ? noop : (...args: unknown[]) => console.info(...args),
  warn: (...args: unknown[]) => console.warn(...args),
  error: (...args: unknown[]) => console.error(...args),
};

export default logger;
export const { debug, log, info, warn, error } = logger;