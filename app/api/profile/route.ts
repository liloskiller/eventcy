import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET as string;


export async function GET(request: Request) {
  try {
    
    const authorization = request.headers.get("Authorization");
    
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const token = authorization.split(" ")[1];
    
    
    const decoded = jwt.verify(token, SECRET_KEY) as { userId: string; email: string };
    
    
    const user = await prisma.users.findUnique({
      where: { id: parseInt(decoded.userId) },
      select: {
        id: true,
        name: true,
        email: true,
        phone_number: true,
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
    console.error("Profile error:", error);
    return NextResponse.json({ error: "Error fetching profile" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const authorization = request.headers.get("Authorization");
    
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const token = authorization.split(" ")[1];
    
    
    const decoded = jwt.verify(token, SECRET_KEY) as { userId: string; email: string };
    
    
    const { name, email, phone_number } = await request.json();
    
    
    await prisma.users.update({
      where: { id: parseInt(decoded.userId) },
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
    console.error("Update profile error:", error);
    return NextResponse.json({ error: "Error updating profile" }, { status: 500 });
  }
}