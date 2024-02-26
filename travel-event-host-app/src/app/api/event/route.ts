import { connectMongoDB } from '@/lib/mongodb';
import Event from '@/schemas/event';
import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';

export async function POST(req: Request) {
  const data = await req.formData();
  const file: File | null = data.get('image') as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // With the file data in the buffer, you can do whatever you want with it.
  // For this, we'll just write it to the filesystem in a new location
  const path = `/te mp/${file.name}`;
  await writeFile(path, buffer);
  console.log(`open ${path} to see the uploaded file`);
  await connectMongoDB();
  const imageUrl = '';
  return NextResponse.json({ message: 'event created the id is ' }, { status: 201 });
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
