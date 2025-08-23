"use client"
import React from "react";
import { useAuth } from "@/modules/auth/contexts/authContext";
import ProfileCard from "@/modules/user/components/ProfileCard";
import { Button } from "@/modules/shared/components/Button";

export default function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = React.use(params);
  const {user} = useAuth();

  const isMe = user?.username === username;

  return (
    <div>
      <ProfileCard></ProfileCard>
    </div>
  );
}
