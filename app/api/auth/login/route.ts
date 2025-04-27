'use client'

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs"; 
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET as string;

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

      // Generate JWT token
        const token = jwt.sign({ userId: user.id, email: user.email }, SECRET_KEY, {
        expiresIn: "7d", 
    });

    return NextResponse.json({ message: "Login successful",token, user });
  } catch (error) {
    return NextResponse.json({ error: "Error logging in" }, { status: 500 });
  }
}