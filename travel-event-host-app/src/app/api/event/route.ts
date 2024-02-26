import { connectMongoDB } from '@/lib/mongodb';
import Event from '@/schemas/event';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  let {
    title = '',
    description = '',
    eventCreatorId = '',
    image,
    participantIds = [],
    location = '' /* {
        country: String,
        state: String,
        city: String,
        coords: { lat: Number, long: Number },
      } */,
    startDate = new Date(),
    endDate = new Date(),
    categories,
  } = await req.json();

  await connectMongoDB();
  const imageUrl = '';
  /*
  const newEvent = await Event.create({
    title,
    description,
    imageUrl,
    participantIds,
    eventCreatorId,
    location,
    startDate,
    endDate,
    categories,
  });

  return NextResponse.json({ message: 'event created the id is ' + newEvent.id }, { status: 201 });*/
}
