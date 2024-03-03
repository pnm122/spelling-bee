import { ObjectId } from "mongodb"

export default interface Session {
  _id: ObjectId,
  sessionId: string
  lastUpdate: string
  expiresAfterSeconds: number
}