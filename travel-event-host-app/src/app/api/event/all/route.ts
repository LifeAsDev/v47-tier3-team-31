import { connectMongoDB } from '@/lib/mongodb';
import Event from '@/schemas/event';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  await connectMongoDB();

  const recentEvents = await Event.find().sort({ createdAt: -1 }).limit(3).exec();

  if (recentEvents.length > 0) {
    return NextResponse.json({ events: recentEvents }, { status: 200 });
  } else {
    return NextResponse.json({ events: [], message: 'No events found' }, { status: 404 });
  }
}
