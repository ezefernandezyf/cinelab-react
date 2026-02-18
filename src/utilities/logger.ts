const enableLogs = import.meta.env?.VITE_ENABLE_LOGS === 'true';
const silentInProd = import.meta.env?.PROD === true && !enableLogs;

const noop = (..._args: unknown[]) => {
  void _args;
  return undefined;
};

const logger = {
  debug: silentInProd ? noop : (...args: unknown[]) => console.debug(...args),
  log: silentInProd ? noop : (...args: unknown[]) => console.log(...args),
  info: silentInProd ? noop : (...args: unknown[]) => console.info(...args),
  warn: (...args: unknown[]) => console.warn(...args),
  error: (...args: unknown[]) => console.error(...args),
};

export default logger;
export const { debug, log, info, warn, error } = logger;
