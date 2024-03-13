import { connectMongoDB } from '@/lib/mongodb';
import Event from '@/schemas/event';
import { NextResponse } from 'next/server';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/app/firebase';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file: File | null = data.get('image') as unknown as File;
    const title: string = data.get('title') as unknown as string;
    const description: string = data.get('description') as unknown as string;
    const eventCreatorId: string = data.get('eventCreatorId') as unknown as string;
    const categories: string[] = data.getAll('categories') as string[];
    const startDate: string = data.get('startDate') as string;
    const endDate: string = data.get('endDate') as string;
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    if (!file) {
      return NextResponse.json({ success: false, error: 'file no supported' });
    }

    const token = jwt.sign({ name: file.name }, `${process.env.NEXTAUTH_SECRET}`);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const storageRef = ref(storage, `images/${token}`);
    const uploadTask = uploadBytesResumable(storageRef, buffer, { contentType: file.type });
    //change only for test
    const imageUrl: string = await new Promise<string>((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {},
        (error) => {
          console.log(error);
          reject(error);
        },
        async () => {
          try {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            console.log('uploaded to firebase boss');
            resolve(url);
          } catch (error) {
            reject(error);
          }
        },
      );
    });

    await connectMongoDB();
    const newEvent = await Event.create({
      title,
      description,
      imageUrl,
      participantIds: [],
      eventCreatorId,
      location: {
        country: 'Brazil',
        state: 'Amazonas',
        city: 'Manaus',
        coords: { lat: 12313, long: 3123 },
      },
      startDate: startDateObj,
      endDate: endDateObj,
      categories,
    });
    console.log(newEvent);

    if (newEvent) {
      return NextResponse.json(
        { message: 'event created the id is ' + newEvent.id, id: newEvent.id },
        { status: 201 },
      );
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: 'error creating event' });
  }
}
