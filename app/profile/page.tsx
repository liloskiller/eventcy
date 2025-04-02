"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import BackButton from "@/components/BackButton";
import { useAuth } from "@/context/AuthContext";

interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone_number: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { user: authUser } = useAuth();

  useEffect(() => {
    if (!authUser) {
      router.push("/login");
      return;
    }
    fetchUserProfile();
  }, [authUser, router]);

  const fetchUserProfile = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        router.push("/login");
        return;
      }
      const response = await fetch("/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("authToken");
          router.push("/login");
          return;
        }
        throw new Error("Failed to fetch profile");
      }
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, "");
    return digits.length >= 3 ? `${digits.slice(0, 2)} ${digits.slice(2)}` : digits;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (user) {
      setUser({ ...user, phone_number: formatPhoneNumber(e.target.value) });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        router.push("/login");
        return;
      }
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });
      if (!response.ok) throw new Error("Failed to update profile");
      setIsEditing(false);
      alert("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6 w-full max-w-md">
          <CardTitle>Error</CardTitle>
          <p>Unable to load profile. Please try again later.</p>
          <Button onClick={() => router.push("/login")}>Back to Login</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <BackButton />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-2xl mx-auto mt-10">
        <Card>
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" value={user.phone_number} onChange={handlePhoneChange} disabled={!isEditing} />
              {isEditing ? (
                <div className="flex justify-end space-x-2">
                  <Button type="submit">Save Changes</Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                </div>
              ) : (
                <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
              )}
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
