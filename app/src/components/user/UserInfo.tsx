"use client";

import { User } from "@/types/user";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface UserProps {
  user: User;
}

export function UserInfo({ user }: UserProps) {
  return (
    <div className="flex items-center gap-2">
      <Avatar className="w-10 h-10 border-2 border-white shadow-lg transition-transform duration-300">
        <AvatarImage src={user.image} />
        <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white font-bold">{user.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <p>{user.name}</p>
    </div>
  );
}
