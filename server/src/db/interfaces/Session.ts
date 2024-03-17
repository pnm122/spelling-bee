import { ObjectId } from "mongodb"
import User from "./User"

// Interface for sessions received from database
export default interface Session {
  _id: ObjectId,
  sessionId: string
  userId: string
  lastUpdate: string
}

// Interface for inserting sessions into the database
export interface SessionInsert {
  sessionId: string
  userId: string
  lastUpdate: Date
}