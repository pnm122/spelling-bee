import { ObjectId } from "mongodb";

// Replace _id ObjectId with id string
type ForClient<T extends { _id: ObjectId }> = Omit<T, '_id'> & { id: string }

export default ForClient