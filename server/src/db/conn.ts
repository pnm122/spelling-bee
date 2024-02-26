import { Db, MongoClient } from 'mongodb';
import debug from '../utils/debug';

const mode = process.env.NODE_ENV
const client = new MongoClient(process.env.MONGODB_URI!)

let db: Db

// Get connection to MongoDB database
export default async function getDb() {
  if(!db) {
    debug('Connecting to db...')
    try {
      const conn = await client.connect()
      db = conn.db('spelling-bee')
      debug('Successfully connected to db.')
    } catch(e) {
      debug('Connection to db failed.', 'error')
      console.error(e)
    }
  }
  return db
}

