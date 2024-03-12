import { ObjectId } from "mongodb"
import User from "./User"

// Interface for sessions received from database
export default interface Session {
  _id: ObjectId,
  sessionId: string
  user: {
    id: string,
    username: string
  }
  lastUpdate: string
}

// Interface for inserting sessions into the database
export interface SessionInsert {
  sessionId: string
  user: {
    id: string,
    username: string
  }
  lastUpdate: Date
}