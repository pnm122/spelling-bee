import { ObjectId } from "mongodb"

// Interface for sessions received from database
export default interface Session {
  _id: ObjectId,
  sessionId: string
  lastUpdate: string
}

// Interface for inserting sessions into the database
export interface SessionInsert {
  sessionId: string,
  lastUpdate: Date
}