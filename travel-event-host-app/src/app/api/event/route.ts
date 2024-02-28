import { connectMongoDB } from '@/lib/mongodb';
import Event from '@/schemas/event';
import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/app/firebase';
import { SetStateAction } from 'react';
import jwt from 'jsonwebtoken';
export async function POST(req: Request) {
  const data = await req.formData();
  const file: File | null = data.get('image') as unknown as File;
  const title: string = data.get('title') as unknown as string;
  const description: string = data.get('description') as unknown as string;
  const eventCreatorId: string = data.get('eventCreatorId') as unknown as string;
  const categories: [string] = data.get('categories') as unknown as [string];

  if (!file) {
    return NextResponse.json({ success: false });
  }

  const token = jwt.sign({ name: file.name }, `${process.env.NEXTAUTH_SECRET}`);
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  console.log(file.name);
  const storageRef = ref(storage, `images/${token}${file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, buffer);
  let imageUrl = '';
  uploadTask.on(
    'state_changed',
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    },
    (error) => {
      console.log(error);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((url: string) => {
        console.log('uploaded to firebase boss');
        imageUrl = url;
      });
    },
  );

  await connectMongoDB();
  const newEvent = await Event.create({
    title,
    description,
    imageUrl,
    participantIds: [],
    eventCreatorId,
    location,
    startDate: new Date(),
    endDate: new Date(),
    categories,
  });
  if (newEvent) {
    return NextResponse.json(
      { message: 'event created the id is ' + newEvent.id },
      { status: 201 },
    );
  }
  return NextResponse.json({ success: false });
}
