import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Adjust path if necessary

export async function POST(request: Request) {
  const { name, email, password_hash } = await request.json();
  try {
    const newUser = await prisma.users.create({
      data: {
        name,
        email,
        password_hash, // Hash the password in production!
      },
    });
    return NextResponse.json({ message: "User created", user: newUser });
  } catch (error) {
    return NextResponse.json({ error: "Error creating user" }, { status: 500 });
  }
}