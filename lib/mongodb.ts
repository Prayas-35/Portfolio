import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGO_URI || '';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGO_URI environment variable in .env.local');
}

let cached: any = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
      cached.promise = mongoose.connect(MONGODB_URI, {
        dbName: 'prayaspal04_db_user',
      }).then(mongoose => mongoose);
    }

  cached.conn = await cached.promise;
  return cached.conn;
}
