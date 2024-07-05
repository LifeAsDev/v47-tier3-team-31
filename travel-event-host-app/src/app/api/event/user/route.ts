import { connectMongoDB } from '@/lib/mongodb';
import Event from '@/schemas/event';
import { NextResponse } from 'next/server';
import User from '@/schemas/user';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  await connectMongoDB();

  const user = await User.findById(id);
  await user.populate({ path: 'eventIds', model: Event });
  const recentEvents = user.eventIds;

  if (recentEvents.length > 0) {
    return NextResponse.json({ events: recentEvents }, { status: 200 });
  } else {
    return NextResponse.json({ events: [], message: 'No events found' }, { status: 404 });
  }
}
