"use client";

import React from "react";
import { useAuth } from "@/modules/auth/contexts/authContext";
import ProfileCard from "@/modules/user/components/ProfileCard";

export default function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = React.use(params);
  const { user } = useAuth();

  const isMe = user?.username?.toLowerCase() === username.toLowerCase();

  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-8 sm:px-6 lg:px-8">
      <ProfileCard username={username} isMe={isMe} />
    </div>
  );
}
