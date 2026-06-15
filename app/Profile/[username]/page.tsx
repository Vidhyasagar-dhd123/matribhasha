"use client"
import React from "react";
import { useAuth } from "@/modules/auth/contexts/authContext";
import ProfileCard from "@/modules/user/components/ProfileCard"

export default function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = React.use(params);
  const {user} = useAuth();

  const isMe = user?.username === username;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.12),transparent_34%),linear-gradient(180deg,#f8fafc_0%,#ecfeff_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <ProfileCard username={username} isMe={isMe} />
    </div>
  );
}
