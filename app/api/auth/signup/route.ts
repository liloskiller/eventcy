import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs"; // Import bcrypt for hashing

export async function POST(request: Request) {
  try {
    const { name, email, password_hash } = await request.json();

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password_hash, 10);

    // Save user in the database
    const newUser = await prisma.users.create({
      data: {
        name,
        email,
        password_hash: hashedPassword, // Store hashed password
      },
    });

    return NextResponse.json({ message: "User created", user: newUser });
  } catch (error) {
    return NextResponse.json({ error: "Error creating user" }, { status: 500 });
  }
}