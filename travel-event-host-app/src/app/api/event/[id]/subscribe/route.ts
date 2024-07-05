import { NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import Event from '@/schemas/event';
import User from '@/schemas/user'; // Asegúrate de importar el modelo de User
import mongoose from 'mongoose';

export async function PATCH(req: Request, { params }: any) {
  let { userId } = await req.json();

  const id = params.id;

  await connectMongoDB();
  const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
  if (!isValidObjectId) {
    return NextResponse.json({ message: 'Invalid ObjectId format' }, { status: 400 });
  }

  const eventFound = await Event.findById(id);

  if (eventFound) {
    const isUserIdAlreadyPresent = eventFound.participantIds.some(
      (participant: { userId: string; timeStamp: Date }) => participant.userId === userId,
    );
    if (!isUserIdAlreadyPresent) {
      eventFound.participantIds.push({ userId, timeStamp: new Date() });
      await eventFound.save();

      // Agrega el id del evento a la lista eventsId del usuario
      const userFound = await User.findById(userId);
      if (userFound) {
        console.log({ userFound });

        if (!userFound.eventIds) {
          userFound.eventIds = [];
        }
        console.log({ userFound });
        console.log({ eventIds: userFound.eventIds });

        if (!userFound.eventIds.includes(id)) {
          userFound.eventIds.push(id);
          await userFound.save();
        }
        return NextResponse.json(
          { message: 'User registered and event added to user' },
          { status: 200 },
        );
      } else {
        return NextResponse.json({ message: 'User does not exist' }, { status: 400 });
      }
    } else {
      return NextResponse.json({ message: 'User already present' }, { status: 409 });
    }
  } else {
    return NextResponse.json({ message: 'Event does not exist' }, { status: 400 });
  }
}
