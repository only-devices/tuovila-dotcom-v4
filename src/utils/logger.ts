import { createClient } from '@supabase/supabase-js';

// Determine if we're in development or production
const isDev = process.env.NODE_ENV === 'development';

// Create a Supabase client for logging
const supabase = createClient(
  process.env.LOG_DB_URL!,
  process.env.LOG_DB_SERVICE_ROLE_KEY!
);

// Define the structure for log details
interface LogDetails {
  [key: string]: any;
}

// Log levels matching the Postgres enum
type LogLevel = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';

// Logging function
async function logToSupabase(
  level: LogLevel, 
  message: string, 
  details: LogDetails = {},
  userId?: string,
  sessionId?: string
) {
  try {
    // Always log to console in development
    if (isDev) {
      if (level === 'ERROR') {
        console.error(message);
        if (Object.keys(details).length > 0) {
          console.error(details);
        }
      } else {
        console.log(`[${level}] ${message}`);
        if (Object.keys(details).length > 0) {
          console.log(details);
        }
      }
    }

    // Log to Supabase
    const { error } = await supabase.from('application_logs').insert({
      level,
      message,
      details: JSON.stringify(details),
      user_id: userId,
      session_id: sessionId
    });

    // If there's an error logging to Supabase, log it to console
    if (error && isDev) {
      console.error('Failed to log to Supabase:', error);
    }
  } catch (err) {
    // Fallback console logging if everything else fails
    if (isDev) {
      console.error('Critical logging error:', err);
    }
  }
}

// Wrapper for error logging
export function logError(message: string, error?: unknown) {
  const details: LogDetails = {};
  if (error) {
    if (error instanceof Error) {
      details.error = {
        message: error.message,
        stack: error.stack
      };
    } else {
      details.error = error;
    }
  }
  return logToSupabase('ERROR', message, details);
}

// Wrapper for warn logging
export function logWarn(message: string, details: LogDetails = {}) {
  return logToSupabase('WARN', message, details);
}

// Wrapper for info logging
export function logInfo(message: string, details: LogDetails = {}) {
  return logToSupabase('INFO', message, details);
}

// Wrapper for debug logging
export function logDebug(message: string, details: LogDetails = {}) {
  return logToSupabase('DEBUG', message, details);
}

// Global error handler
export function setupGlobalErrorHandling() {
  if (typeof process !== 'undefined') {
    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      logError('Unhandled Promise Rejection', reason);
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logError('Uncaught Exception', error);
    });
  }
}
