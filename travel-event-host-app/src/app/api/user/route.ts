import { connectMongoDB } from '@/lib/mongodb';
import User from '@/schemas/user';
import { SecureUser } from '@/types/secureUser';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: any) {
  const { searchParams } = new URL(req.url);
  const ids = searchParams.getAll('id'); // Use getAll to get all values for the 'id' parameter
  await connectMongoDB();

  // Validate each ObjectId in the array of IDs
  const isValidObjectId = ids.every((id) => mongoose.Types.ObjectId.isValid(id));
  if (!isValidObjectId) {
    return NextResponse.json({ message: 'Invalid ObjectId format' }, { status: 400 });
  }
  console.log(ids);
  // Find users with the given IDs
  const usersFound = await User.find({ _id: { $in: ids } }).select('firstName imageUrl lastName');
  const attendees: SecureUser[] = usersFound.map((user) => user.toObject()); // Convert each user to plain object
  return NextResponse.json({ attendees }, { status: 200 });
}
