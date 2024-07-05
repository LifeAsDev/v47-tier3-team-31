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
    const isUserIdPresent = eventFound.participantIds.some(
      (participant: { userId: string; timeStamp: Date }) => participant.userId === userId,
    );

    if (isUserIdPresent) {
      eventFound.participantIds = eventFound.participantIds.filter(
        (participant: { userId: string; timeStamp: Date }) => participant.userId !== userId,
      );
      await eventFound.save();

      // Elimina el id del evento de la lista eventsId del usuario
      const userFound = await User.findById(userId);
      if (userFound) {
        console.log('userFound');
        if (!userFound.eventIds) {
          userFound.eventIds = [];
        }
        userFound.eventIds = userFound.eventIds.filter(
          (eventId: { toString: () => any }) => eventId.toString() !== id,
        );
        await userFound.save();
        return NextResponse.json(
          { message: 'User unregistered and event removed from user' },
          { status: 200 },
        );
      } else {
        return NextResponse.json({ message: 'User does not exist' }, { status: 400 });
      }
    }

    return NextResponse.json({ message: 'User not present on event' }, { status: 400 });
  } else {
    return NextResponse.json({ message: 'Event does not exist' }, { status: 404 });
  }
}
