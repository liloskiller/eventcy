import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs"; // Import bcrypt for password comparison

export async function POST(request: Request) {
  try {
    const { email, password_hash } = await request.json();

    // Find user by email
    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password_hash, user.password_hash);

    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    return NextResponse.json({ message: "Login successful", user });
  } catch (error) {
    return NextResponse.json({ error: "Error logging in" }, { status: 500 });
  }
}