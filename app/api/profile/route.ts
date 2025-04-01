import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET as string;

// GET handler for fetching the profile
export async function GET(request: Request) {
  try {
    // Get the token from the Authorization header
    const authorization = request.headers.get("Authorization");
    
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const token = authorization.split(" ")[1];
    
    // Verify the token
    const decoded = jwt.verify(token, SECRET_KEY) as { userId: number; email: string };
    
    // Get user data from database
    const user = await prisma.users.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone_number: true,
        // Don't include password_hash in the response
      }
    });
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    return NextResponse.json({ error: "Error fetching profile" }, { status: 500 });
  }
}

// PUT handler for updating the profile
export async function PUT(request: Request) {
  try {
    // Get the token from the Authorization header
    const authorization = request.headers.get("Authorization");
    
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const token = authorization.split(" ")[1];
    
    // Verify the token
    const decoded = jwt.verify(token, SECRET_KEY) as { userId: number; email: string };
    
    // Get the updated user data from the request body
    const { name, email, phone_number } = await request.json();
    
    // Update the user in the database
    await prisma.users.update({
      where: { id: decoded.userId },
      data: {
        name,
        email,
        phone_number
      }
    });
    
    return NextResponse.json({ message: "Profile updated successfully" });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    return NextResponse.json({ error: "Error updating profile" }, { status: 500 });
  }
}