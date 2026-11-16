import mongoose from 'mongoose';

/**
 * MongoDB Connection Manager for Relay
 * Handles connection lifecycle, status reporting, and safe credential masking.
 */

let isConnecting = false;

export const getDbStatus = () => {
  const readyState = mongoose.connection.readyState;
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  const host = mongoose.connection.host || null;
  const name = mongoose.connection.name || null;

  return {
    status: states[readyState] || 'unknown',
    readyState,
    host: host ? host.replace(/:[^:]*@/, '@') : null, // sanitize host if needed
    name
  };
};

export const connectDB = async (customUri = null) => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (isConnecting) {
    // Wait for in-flight connection
    return new Promise((resolve, reject) => {
      mongoose.connection.once('connected', () => resolve(mongoose.connection));
      mongoose.connection.once('error', reject);
    });
  }

  let uri = customUri || process.env.MONGODB_URI;

  if (!uri) {
    console.warn('[Relay DB] MONGODB_URI not configured. Database operations will wait for connection.');
    return null;
  }

  // Isolate tests from production database by routing to relay_test
  if (process.env.NODE_ENV === 'test' && !customUri) {
    if (uri.includes('/relay?')) {
      uri = uri.replace('/relay?', '/relay_test?');
    } else if (uri.endsWith('/relay')) {
      uri = uri.replace('/relay', '/relay_test');
    }
  }

  try {
    isConnecting = true;
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: true
    });

    const sanitizedUri = uri.replace(/:([^:@]+)@/, ':****@');
    console.log(`[Relay DB] Connected to MongoDB: ${conn.connection.host}/${conn.connection.name} (${sanitizedUri})`);
    isConnecting = false;
    return conn;
  } catch (error) {
    isConnecting = false;
    console.error('[Relay DB] MongoDB connection error:', error.message);
    throw error;
  }
};

export const disconnectDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log('[Relay DB] Disconnected from MongoDB');
  }
};
