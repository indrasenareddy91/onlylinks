import { Adapter } from "next-auth/adapters"
import mongoose from 'mongoose'
import { User } from '@/models/User' // Adjust the import path as needed
import { ObjectId } from 'mongodb'

export function MongooseAdapter(conn: Promise<typeof mongoose>): Adapter {
  return {
    
  }
}