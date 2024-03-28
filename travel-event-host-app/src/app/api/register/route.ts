import { NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import User from '@/schemas/user';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
  let { email, password, name } = await req.json();
  email = email.toUpperCase();

  let hashedPassword = '';

  await connectMongoDB();
  function getRandomRGBColor(): string {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
  }

  const imageUrl = getRandomRGBColor();
  if (password) {
    hashedPassword = await bcrypt.hash(password, 10);
  }
  const userExist1 = await User.findOne({
    email: email,
  }).select('email');

  if (userExist1) {
    console.log('user existed');

    return NextResponse.json({ error: { email: ['Email already in use'] } }, { status: 403 });
  } else {
    const newUser = await User.create({
      email,
      password: hashedPassword,
      firstName: name,
      imageUrl,
    });
    console.log('user created');

    return NextResponse.json({ message: 'User Created' }, { status: 201 });
  }
}
